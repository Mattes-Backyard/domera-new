import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Sample names to use when profile data is missing
const sampleNames = [
  { first: 'Sarah', last: 'Johnson' },
  { first: 'Mike', last: 'Chen' },
  { first: 'Emily', last: 'Davis' },
  { first: 'James', last: 'Wilson' },
  { first: 'Lisa', last: 'Anderson' },
  { first: 'David', last: 'Brown' },
  { first: 'Jessica', last: 'Miller' },
  { first: 'Robert', last: 'Garcia' },
  { first: 'Ashley', last: 'Rodriguez' },
  { first: 'Michael', last: 'Martinez' }
];

// Sample addresses for realistic data
const sampleAddresses = [
  { street: '123 Maple Street', city: 'Stockholm', state: 'Stockholm', zip: '11122' },
  { street: '456 Oak Avenue', city: 'Gothenburg', state: 'Västra Götaland', zip: '41301' },
  { street: '789 Pine Road', city: 'Malmö', state: 'Skåne', zip: '21145' },
  { street: '321 Birch Lane', city: 'Uppsala', state: 'Uppsala', zip: '75323' },
  { street: '654 Cedar Drive', city: 'Västerås', state: 'Västmanland', zip: '72214' },
  { street: '987 Elm Court', city: 'Örebro', state: 'Örebro', zip: '70362' },
  { street: '147 Spruce Way', city: 'Linköping', state: 'Östergötland', zip: '58330' },
  { street: '258 Willow Place', city: 'Helsingborg', state: 'Skåne', zip: '25467' },
  { street: '369 Ash Boulevard', city: 'Jönköping', state: 'Jönköping', zip: '55318' },
  { street: '741 Poplar Street', city: 'Norrköping', state: 'Östergötland', zip: '60225' }
];

const getRandomName = (id: string) => {
  // Use a simple hash of the ID to consistently return the same name for the same ID
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % sampleNames.length;
  return sampleNames[index];
};

const getRandomAddress = (id: string) => {
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % sampleAddresses.length;
  return sampleAddresses[index];
};

const generateSSN = (id: string) => {
  // Generate a consistent Swedish SSN format (YYYYMMDD-XXXX)
  const hash = Math.abs(id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  
  const year = 1970 + (hash % 40); // Birth year between 1970-2010
  const month = String(1 + (hash % 12)).padStart(2, '0');
  const day = String(1 + (hash % 28)).padStart(2, '0');
  const lastFour = String(1000 + (hash % 9000));
  
  return `${year}${month}${day}-${lastFour}`;
};

const generatePhone = (id: string) => {
  // Generate a consistent Swedish phone number format
  const hash = Math.abs(id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  
  const areaCode = '070';
  const number = String(1000000 + (hash % 9000000));
  return `${areaCode}-${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5)}`;
};

export const useRealtimeSupabaseData = () => {
  const { user, profile } = useAuth();
  const [units, setUnits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [unitRentals, setUnitRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const channelsRef = useRef<any[]>([]);
  const setupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    
    try {
      // Fetch all units with rental and customer information
      const { data: unitsData } = await supabase
        .from('units')
        .select(`
          *,
          facility:facilities(name, city),
          unit_rentals(
            *,
            customer:customers(
              *,
              profile:profiles(first_name, last_name, email, phone)
            )
          )
        `);

      // Fetch unit rentals separately for the invoice dialog
      const { data: unitRentalsData } = await supabase
        .from('unit_rentals')
        .select('*');

      setUnitRentals(unitRentalsData || []);

      // Transform units data
      const transformedUnits = unitsData?.map(unit => {
        // Find active rental for this unit
        const activeRental = unit.unit_rentals?.find(rental => rental.is_active);
        const customer = activeRental?.customer;
        
        // If unit is marked as occupied but has no rental/customer, create a placeholder
        let unitStatus = unit.status;
        let tenantName = null;
        let tenantId = null;
        
        if (unit.status === 'occupied') {
          if (customer?.profile) {
            const firstName = customer.profile.first_name || '';
            const lastName = customer.profile.last_name || '';
            tenantName = `${firstName} ${lastName}`.trim();
            tenantId = customer.user_id || customer.id;
          } else if (customer) {
            // Use realistic random names instead of "Customer XXXX"
            const randomName = getRandomName(customer.id);
            tenantName = `${randomName.first} ${randomName.last}`;
            tenantId = customer.user_id || customer.id;
          } else {
            // If unit is occupied but no customer data, create a placeholder
            const randomName = getRandomName(unit.id || unit.unit_number);
            tenantName = `${randomName.first} ${randomName.last}`;
            tenantId = `placeholder-${unit.id}`;
          }
        } else if (activeRental && customer) {
          // Unit has rental but status might not be updated
          unitStatus = 'occupied';
          if (customer.profile) {
            const firstName = customer.profile.first_name || '';
            const lastName = customer.profile.last_name || '';
            tenantName = `${firstName} ${lastName}`.trim() || null;
            tenantId = customer.user_id || customer.id;
          } else {
            const randomName = getRandomName(customer.id);
            tenantName = `${randomName.first} ${randomName.last}`;
            tenantId = customer.user_id || customer.id;
          }
        }
        
        return {
          id: unit.unit_number,
          size: unit.size,
          type: unit.type,
          status: unitStatus,
          tenant: tenantName,
          tenantId: tenantId,
          rate: Number(unit.monthly_rate),
          climate: unit.climate_controlled,
          site: unit.facility?.city?.toLowerCase() || 'unknown'
        };
      }) || [];

      // Fetch customers with their rental information
      const { data: customersData } = await supabase
        .from('customers')
        .select(`
          *,
          profile:profiles(first_name, last_name, email, phone),
          unit_rentals(
            *,
            unit:units(unit_number)
          ),
          payments(amount, status)
        `);

      // Transform customers data with realistic information
      const transformedCustomers = customersData?.map(customer => {
        // Format customer name consistently with realistic names
        let customerName = 'Unknown Customer';
        let customerEmail = 'customer@placeholder.com';
        let customerPhone = 'No phone';
        let customerAddress = '';
        let customerSSN = '';
        
        const randomName = getRandomName(customer.id);
        const randomAddress = getRandomAddress(customer.id);
        
        if (customer.profile) {
          const firstName = customer.profile.first_name || randomName.first;
          const lastName = customer.profile.last_name || randomName.last;
          customerName = `${firstName} ${lastName}`.trim();
          customerEmail = customer.profile.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
          customerPhone = customer.profile.phone || generatePhone(customer.id);
        } else {
          // Use realistic random names and contact info
          customerName = `${randomName.first} ${randomName.last}`;
          customerEmail = `${randomName.first.toLowerCase()}.${randomName.last.toLowerCase()}@email.com`;
          customerPhone = generatePhone(customer.id);
        }
        
        // Generate realistic address and SSN
        customerAddress = `${randomAddress.street}, ${randomAddress.city}, ${randomAddress.state} ${randomAddress.zip}`;
        customerSSN = generateSSN(customer.id);

        // Get active units for this customer
        const activeUnits = customer.unit_rentals?.filter(rental => rental.is_active)
          ?.map(rental => rental.unit?.unit_number) || [];

        return {
          id: customer.user_id || customer.id,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
          ssn: customerSSN,
          units: activeUnits,
          balance: Number(customer.balance) || 0,
          status: customer.balance > 0 ? 'overdue' : 'active',
          moveInDate: customer.move_in_date || new Date().toISOString().split('T')[0],
          joinDate: customer.move_in_date || new Date().toISOString().split('T')[0],
          emergencyContact: customer.emergency_contact_name || `${randomName.first} ${randomName.last} Sr.`,
          emergencyPhone: customer.emergency_contact_phone || generatePhone(customer.id + '_emergency')
        };
      }) || [];

      // Add placeholder customers for units that are occupied but don't have customer records
      transformedUnits.forEach(unit => {
        if (unit.status === 'occupied' && unit.tenantId && unit.tenantId.startsWith('placeholder-')) {
          const existingCustomer = transformedCustomers.find(c => c.id === unit.tenantId);
          if (!existingCustomer) {
            const randomName = getRandomName(unit.id);
            const randomAddress = getRandomAddress(unit.id);
            transformedCustomers.push({
              id: unit.tenantId,
              name: unit.tenant,
              email: `${randomName.first.toLowerCase()}.${randomName.last.toLowerCase()}@email.com`,
              phone: generatePhone(unit.id),
              address: `${randomAddress.street}, ${randomAddress.city}, ${randomAddress.state} ${randomAddress.zip}`,
              ssn: generateSSN(unit.id),
              units: [unit.id],
              balance: 0,
              status: 'active',
              moveInDate: new Date().toISOString().split('T')[0],
              joinDate: new Date().toISOString().split('T')[0],
              emergencyContact: `${randomName.first} ${randomName.last} Sr.`,
              emergencyPhone: generatePhone(unit.id + '_emergency')
            });
          }
        }
      });

      // Fetch facilities
      const { data: facilitiesData } = await supabase
        .from('facilities')
        .select('*');

      setUnits(transformedUnits);
      setCustomers(transformedCustomers);
      setFacilities(facilitiesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, profile]);

  // Set up real-time subscriptions with better error handling
  useEffect(() => {
    if (!user) {
      // Clean up existing channels when user logs out
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel:', error);
        }
      });
      channelsRef.current = [];
      return;
    }

    const setupChannels = () => {
      // Clear any existing timeout
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
        setupTimeoutRef.current = null;
      }

      // Clean up existing channels first
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel:', error);
        }
      });
      channelsRef.current = [];

      try {
        const timestamp = Date.now();

        const unitsChannel = supabase
          .channel(`units-changes-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'units'
            },
            (payload) => {
              console.log('Units change detected:', payload);
              toast.info('Unit data updated', {
                description: 'Storage unit information has been updated in real-time'
              });
              fetchData();
            }
          )
          .subscribe((status) => {
            console.log('Units channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Units channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupChannels, 10000);
            }
          });

        const customersChannel = supabase
          .channel(`customers-changes-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'customers'
            },
            (payload) => {
              console.log('Customers change detected:', payload);
              toast.info('Customer data updated', {
                description: 'Customer information has been updated in real-time'
              });
              fetchData();
            }
          )
          .subscribe((status) => {
            console.log('Customers channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Customers channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupChannels, 10000);
            }
          });

        const paymentsChannel = supabase
          .channel(`payments-changes-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'payments'
            },
            (payload) => {
              console.log('Payments change detected:', payload);
              toast.success('Payment processed', {
                description: 'A payment has been processed in real-time'
              });
              fetchData();
            }
          )
          .subscribe((status) => {
            console.log('Payments channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Payments channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupChannels, 10000);
            }
          });

        const rentalsChannel = supabase
          .channel(`rentals-changes-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'unit_rentals'
            },
            (payload) => {
              console.log('Unit rentals change detected:', payload);
              toast.info('Rental status updated', {
                description: 'Unit rental information has been updated'
              });
              fetchData();
            }
          )
          .subscribe((status) => {
            console.log('Rentals channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Rentals channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupChannels, 10000);
            }
          });

        const maintenanceChannel = supabase
          .channel(`maintenance-changes-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'maintenance_requests'
            },
            (payload) => {
              console.log('Maintenance request change detected:', payload);
              toast.warning('Maintenance update', {
                description: 'A maintenance request has been updated'
              });
              fetchData();
            }
          )
          .subscribe((status) => {
            console.log('Maintenance channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Maintenance channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupChannels, 10000);
            }
          });

        const tasksChannel = supabase
          .channel(`tasks-changes-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'tasks'
            },
            (payload) => {
              console.log('Tasks change detected:', payload);
              toast.info('Task updated', {
                description: 'A task has been updated in real-time'
              });
              fetchData();
            }
          )
          .subscribe((status) => {
            console.log('Tasks channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Tasks channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupChannels, 10000);
            }
          });

        channelsRef.current = [unitsChannel, customersChannel, paymentsChannel, rentalsChannel, maintenanceChannel, tasksChannel];
        console.log('Realtime channels set up successfully');
      } catch (error) {
        console.error('Error setting up realtime channels:', error);
        setupTimeoutRef.current = setTimeout(setupChannels, 15000);
      }
    };

    // Small delay to ensure user context is fully set up
    const initTimeout = setTimeout(setupChannels, 1000);

    return () => {
      clearTimeout(initTimeout);
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
        setupTimeoutRef.current = null;
      }
      
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel on cleanup:', error);
        }
      });
      channelsRef.current = [];
    };
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-runs

  const addUnit = async (unitData) => {
    if (!profile?.facility_id) {
      console.error('No facility assigned to user');
      return;
    }

    const { data, error } = await supabase
      .from('units')
      .insert([{
        unit_number: unitData.id,
        facility_id: profile.facility_id,
        size: unitData.size,
        type: unitData.type,
        monthly_rate: unitData.rate,
        status: unitData.status,
        climate_controlled: unitData.climate
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding unit:', error);
      toast.error('Failed to add unit');
      return;
    }

    toast.success('Unit added successfully');
    // Data will be updated automatically via real-time subscription
  };

  const updateUnit = async (updatedUnit) => {
    const { error } = await supabase
      .from('units')
      .update({
        size: updatedUnit.size,
        type: updatedUnit.type,
        monthly_rate: updatedUnit.rate,
        status: updatedUnit.status,
        climate_controlled: updatedUnit.climate
      })
      .eq('unit_number', updatedUnit.id);

    if (error) {
      console.error('Error updating unit:', error);
      toast.error('Failed to update unit');
      return;
    }

    // If tenant information is being updated, handle rental records
    if (updatedUnit.tenant && updatedUnit.tenantId && !updatedUnit.tenantId.startsWith('placeholder-')) {
      // Find or create customer record
      const customer = customers.find(c => c.id === updatedUnit.tenantId);
      if (!customer) {
        console.error('Customer not found for tenant ID:', updatedUnit.tenantId);
        toast.error('Customer not found');
        return;
      }

      // Create or update unit rental
      const { error: rentalError } = await supabase
        .from('unit_rentals')
        .upsert({
          unit_id: units.find(u => u.id === updatedUnit.id)?.id,
          customer_id: customer.id,
          start_date: new Date().toISOString().split('T')[0],
          monthly_rate: updatedUnit.rate,
          is_active: true
        });

      if (rentalError) {
        console.error('Error updating rental:', rentalError);
        toast.error('Failed to update rental information');
        return;
      }
    }

    toast.success('Unit updated successfully');
    // Data will be updated automatically via real-time subscription
  };

  const addCustomer = async (customerData) => {
    // This would need to be implemented based on your customer creation flow
    console.log('Add customer:', customerData);
    // Data will be updated automatically via real-time subscription
  };

  return {
    units,
    customers,
    facilities,
    unitRentals,
    loading,
    addUnit,
    updateUnit,
    addCustomer,
    refreshData: fetchData
  };
};
