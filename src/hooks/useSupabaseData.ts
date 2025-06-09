
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
      // Fetch units based on user role and tenant isolation
      let unitsQuery = supabase
        .from('units')
        .select(`
          *,
          facility:facilities(name, city, tenant_id),
          unit_rentals(
            *,
            customer:customers(
              id,
              user_id,
              first_name,
              last_name,
              email,
              phone,
              emergency_contact_name,
              emergency_contact_phone
            )
          )
        `);

      // Apply tenant filtering based on user role
      if (profile.role === 'admin') {
        // Admins can see all units in their tenant
        const { data: userFacility } = await supabase
          .from('facilities')
          .select('tenant_id')
          .eq('id', profile.facility_id)
          .single();
        
        if (userFacility?.tenant_id) {
          const { data: tenantFacilities } = await supabase
            .from('facilities')
            .select('id')
            .eq('tenant_id', userFacility.tenant_id);
          
          const facilityIds = tenantFacilities?.map(f => f.id) || [];
          if (facilityIds.length > 0) {
            unitsQuery = unitsQuery.in('facility_id', facilityIds);
          }
        }
      } else {
        // Managers and customers see only their facility
        unitsQuery = unitsQuery.eq('facility_id', profile.facility_id);
      }

      const { data: unitsData } = await unitsQuery;

      // Transform units data to match existing format
      const transformedUnits = unitsData?.map(unit => {
        // Find the active rental for this unit
        const activeRental = unit.unit_rentals?.find(rental => rental.is_active === true);
        const customer = activeRental?.customer;
        
        // Determine the actual unit status based on rental data
        let unitStatus = unit.status;
        let customerName = null;
        let customerId = null;
        
        if (activeRental && customer) {
          // Unit has an active rental, so it should be occupied
          unitStatus = 'occupied';
          
          // Build customer name from available data
          const firstName = customer.first_name || '';
          const lastName = customer.last_name || '';
          
          if (firstName || lastName) {
            customerName = `${firstName} ${lastName}`.trim();
          } else if (customer.emergency_contact_name) {
            customerName = customer.emergency_contact_name;
          } else {
            customerName = customer.email || 'Unknown Customer';
          }
          
          customerId = customer.user_id || customer.id;
        } else if (unit.status === 'occupied') {
          // Unit is marked as occupied but has no active rental - fix this
          unitStatus = 'available';
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
          site: unit.facility?.city?.toLowerCase() || 'unknown',
          facility: unit.facility ? {
            id: unit.facility_id,
            name: unit.facility.name
          } : null
        };
      }) || [];

      // Fetch customers with tenant isolation
      let customersQuery = supabase
        .from('customers')
        .select(`
          *,
          unit_rentals(
            *,
            unit:units(unit_number, facility_id)
          )
        `);

      // Apply tenant filtering for customers
      if (profile.role === 'admin') {
        // Admins can see all customers in their tenant
        const { data: userFacility } = await supabase
          .from('facilities')
          .select('tenant_id')
          .eq('id', profile.facility_id)
          .single();
        
        if (userFacility?.tenant_id) {
          const { data: tenantFacilities } = await supabase
            .from('facilities')
            .select('id')
            .eq('tenant_id', userFacility.tenant_id);
          
          const facilityIds = tenantFacilities?.map(f => f.id) || [];
          if (facilityIds.length > 0) {
            customersQuery = customersQuery.in('facility_id', facilityIds);
          }
        }
      } else {
        // Managers and customers see only their facility
        customersQuery = customersQuery.eq('facility_id', profile.facility_id);
      }

      const { data: customersData } = await customersQuery;

      // Transform customers to match our type interface with safe property access
      const transformedCustomers = customersData?.map((customer: any) => ({
        ...customer,
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

      // Fetch facilities based on tenant access
      let facilitiesQuery = supabase.from('facilities').select('*');
      
      if (profile.role === 'admin') {
        // Admins can see all facilities in their tenant
        const { data: userFacility } = await supabase
          .from('facilities')
          .select('tenant_id')
          .eq('id', profile.facility_id)
          .single();
        
        if (userFacility?.tenant_id) {
          facilitiesQuery = facilitiesQuery.eq('tenant_id', userFacility.tenant_id);
        }
      } else {
        // Managers and customers see only their facility
        facilitiesQuery = facilitiesQuery.eq('id', profile.facility_id);
      }

      const { data: facilitiesData } = await facilitiesQuery;
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

    await fetchData();
  };

  const addCustomer = async (customerData) => {
    if (!profile?.facility_id) {
      console.error('No facility assigned to user');
      return;
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([{
        ...customerData,
        facility_id: profile.facility_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding customer:', error);
      return;
    }

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
