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

const getRandomName = (id: string) => {
  // Use a simple hash of the ID to consistently return the same name for the same ID
  const hash = id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % sampleNames.length;
  return sampleNames[index];
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

      // Transform customers data
      const transformedCustomers = customersData?.map(customer => {
        let customerName = 'Unknown Customer';
        let customerEmail = 'customer@placeholder.com';
        
        if (customer.profile) {
          const firstName = customer.profile.first_name || '';
          const lastName = customer.profile.last_name || '';
          customerName = `${firstName} ${lastName}`.trim();
          customerEmail = customer.profile.email || 'customer@placeholder.com';
          
          if (!customerName) {
            const randomName = getRandomName(customer.id);
            customerName = `${randomName.first} ${randomName.last}`;
            customerEmail = `${randomName.first.toLowerCase()}.${randomName.last.toLowerCase()}@email.com`;
          }
        } else {
          // Use realistic random names and emails instead of "Customer XXXX"
          const randomName = getRandomName(customer.id);
          customerName = `${randomName.first} ${randomName.last}`;
          customerEmail = `${randomName.first.toLowerCase()}.${randomName.last.toLowerCase()}@email.com`;
        }
        
        return {
          id: customer.user_id,
          name: customerName,
          email: customerEmail,
          phone: customer.profile?.phone || '',
          units: customer.unit_rentals?.map(rental => rental.unit?.unit_number) || [],
          balance: Number(customer.balance) || 0,
          status: customer.balance > 0 ? 'overdue' : 'good',
          moveInDate: customer.move_in_date,
          emergencyContact: customer.emergency_contact_name,
          emergencyPhone: customer.emergency_contact_phone
        };
      }) || [];

      // Add placeholder customers for units that are occupied but don't have customer records
      transformedUnits.forEach(unit => {
        if (unit.status === 'occupied' && unit.tenantId && unit.tenantId.startsWith('placeholder-')) {
          const existingCustomer = transformedCustomers.find(c => c.id === unit.tenantId);
          if (!existingCustomer) {
            const randomName = getRandomName(unit.id);
            transformedCustomers.push({
              id: unit.tenantId,
              name: unit.tenant,
              email: `${randomName.first.toLowerCase()}.${randomName.last.toLowerCase()}@email.com`,
              phone: '555-0000',
              units: [unit.id],
              balance: 0,
              status: 'good',
              moveInDate: new Date().toISOString().split('T')[0],
              emergencyContact: '',
              emergencyPhone: ''
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
