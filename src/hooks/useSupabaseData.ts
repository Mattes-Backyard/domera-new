
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { DatabaseCustomer } from '@/types/customer';

export const useSupabaseData = () => {
  const { user, profile } = useAuth();
  const [units, setUnits] = useState([]);
  const [customers, setCustomers] = useState<DatabaseCustomer[]>([]);
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
            customer:customers(*)
          )
        `);

      // Transform units data to match existing format
      const transformedUnits = unitsData?.map(unit => {
        const activeRental = unit.unit_rentals?.find(rental => rental.is_active);
        const customer = activeRental?.customer;
        
        let unitStatus = unit.status;
        let customerName = null;
        let customerId = null;
        
        if (unit.status === 'occupied' && customer) {
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

      // Fetch customers directly from database
      const { data: customersData } = await supabase
        .from('customers')
        .select(`
          *,
          unit_rentals(
            *,
            unit:units(unit_number)
          )
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
