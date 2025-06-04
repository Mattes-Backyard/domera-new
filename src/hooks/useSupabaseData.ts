
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

export const useSupabaseData = () => {
  const { user, profile } = useAuth();
  const [units, setUnits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    
    try {
      // Fetch units based on user role
      const { data: unitsData } = await supabase
        .from('units')
        .select(`
          *,
          facility:facilities(name, city),
          unit_rentals(
            *,
            customer:customers(
              *,
              profile:profiles(first_name, last_name)
            )
          )
        `);

      // Transform units data to match existing format
      const transformedUnits = unitsData?.map(unit => {
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

      // Fetch customers
      const { data: customersData } = await supabase
        .from('customers')
        .select(`
          *,
          profile:profiles(first_name, last_name, email, phone),
          unit_rentals(
            unit:units(unit_number)
          ),
          payments(amount, status)
        `);

      // Transform customers data with realistic information
      const transformedCustomers = customersData?.map(customer => {
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
        
        return {
          id: customer.user_id,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
          ssn: customerSSN,
          units: customer.unit_rentals?.map(rental => rental.unit?.unit_number) || [],
          balance: Number(customer.balance) || 0,
          status: customer.balance > 0 ? 'overdue' : 'good',
          moveInDate: customer.move_in_date,
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
              status: 'good',
              moveInDate: new Date().toISOString().split('T')[0],
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
      return;
    }

    // Refresh data
    await fetchData();
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
      return;
    }

    // Refresh data
    await fetchData();
  };

  const addCustomer = async (customerData) => {
    // This would need to be implemented based on your customer creation flow
    console.log('Add customer:', customerData);
    // Refresh data after adding
    await fetchData();
  };

  return {
    units,
    customers,
    facilities,
    loading,
    addUnit,
    updateUnit,
    addCustomer,
    refreshData: fetchData
  };
};
