import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { DatabaseCustomer } from '@/types/customer';

export const useRealtimeSupabaseData = () => {
  const { user, profile } = useAuth();
  const [units, setUnits] = useState([]);
  const [customers, setCustomers] = useState<DatabaseCustomer[]>([]);
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
            customer:customers(*)
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
        
        let unitStatus = unit.status;
        let customerName = null;
        let customerId = null;
        
        if (unit.status === 'occupied' && customer) {
          // Create name from available database fields
          const firstName = customer.first_name || '';
          const lastName = customer.last_name || '';
          customerName = `${firstName} ${lastName}`.trim() || customer.emergency_contact_name || 'Unknown Customer';
          customerId = customer.user_id || customer.id;
        } else if (activeRental && customer) {
          unitStatus = 'occupied';
          const firstName = customer.first_name || '';
          const lastName = customer.last_name || '';
          customerName = `${firstName} ${lastName}`.trim() || customer.emergency_contact_name || 'Unknown Customer';
          customerId = customer.user_id || customer.id;
        }
        
        return {
          id: unit.unit_number,
          size: unit.size,
          type: unit.type,
          status: unitStatus,
          tenant: customerName,
          tenantId: customerId,
          rate: Number(unit.monthly_rate),
          climate: unit.climate_controlled,
          site: unit.facility?.city?.toLowerCase() || 'unknown'
        };
      }) || [];

      // Fetch customers with their rental information directly from database
      const { data: customersData } = await supabase
        .from('customers')
        .select(`
          *,
          unit_rentals(
            *,
            unit:units(unit_number)
          ),
          payments(amount, status)
        `);

      // Transform customers to match our type interface
      const transformedCustomers = customersData?.map(customer => ({
        ...customer,
        // Add computed fields for compatibility
        first_name: customer.first_name || customer.emergency_contact_name?.split(' ')[0] || '',
        last_name: customer.last_name || customer.emergency_contact_name?.split(' ').slice(1).join(' ') || '',
        email: customer.email || `customer${customer.id.slice(0, 8)}@storage.com`,
        phone: customer.phone || customer.emergency_contact_phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip_code: customer.zip_code || '',
        ssn: customer.ssn || '',
        status: customer.status || 'active',
        join_date: customer.join_date || customer.move_in_date || new Date().toISOString().split('T')[0]
      })) || [];

      setUnits(transformedUnits);
      setCustomers(transformedCustomers);

      // Fetch facilities
      const { data: facilitiesData } = await supabase
        .from('facilities')
        .select('*');

      setFacilities(facilitiesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
  }, [user?.id]);

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
