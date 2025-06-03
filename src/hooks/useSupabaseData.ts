
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
      const transformedUnits = unitsData?.map(unit => ({
        id: unit.unit_number,
        size: unit.size,
        type: unit.type,
        status: unit.status,
        tenant: unit.unit_rentals?.[0]?.customer?.profile ? 
          `${unit.unit_rentals[0].customer.profile.first_name} ${unit.unit_rentals[0].customer.profile.last_name}`.trim() : 
          null,
        tenantId: unit.unit_rentals?.[0]?.customer?.user_id || null,
        rate: Number(unit.monthly_rate),
        climate: unit.climate_controlled,
        site: unit.facility?.city?.toLowerCase() || 'unknown'
      })) || [];

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
      const transformedCustomers = customersData?.map(customer => ({
        id: customer.user_id,
        name: customer.profile ? 
          `${customer.profile.first_name} ${customer.profile.last_name}`.trim() : 
          'Unknown',
        email: customer.profile?.email || '',
        phone: customer.profile?.phone || '',
        units: customer.unit_rentals?.map(rental => rental.unit?.unit_number) || [],
        balance: Number(customer.balance) || 0,
        status: customer.balance > 0 ? 'overdue' : 'good',
        moveInDate: customer.move_in_date,
        emergencyContact: customer.emergency_contact_name,
        emergencyPhone: customer.emergency_contact_phone
      })) || [];

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
