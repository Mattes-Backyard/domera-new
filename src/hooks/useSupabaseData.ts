
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { DatabaseCustomer } from '@/types/customer';

export const useSupabaseData = () => {
  const { user, profile } = useAuth();
  const [units, setUnits] = useState([]);
  const [customers, setCustomers] = useState<DatabaseCustomer[]>([]);
  const [facilities, setFacilities] = useState([]);
  const [customerUnits, setCustomerUnits] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    
    try {
      // Fetch units with proper relationships
      let unitsQuery = supabase
        .from('units')
        .select(`
          *,
          facility:facilities(id, name, city, state, country, tenant_id),
          unit_rentals!inner(
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
        `)
        .eq('unit_rentals.is_active', true);

      // Apply tenant filtering based on user role
      if (profile.role === 'admin') {
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
        unitsQuery = unitsQuery.eq('facility_id', profile.facility_id);
      }

      // Fetch occupied units
      const { data: occupiedUnitsData } = await unitsQuery;

      // Fetch all units (including available ones)
      let allUnitsQuery = supabase
        .from('units')
        .select(`
          *,
          facility:facilities(id, name, city, state, country, tenant_id)
        `);

      // Apply same tenant filtering for all units
      if (profile.role === 'admin') {
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
            allUnitsQuery = allUnitsQuery.in('facility_id', facilityIds);
          }
        }
      } else {
        allUnitsQuery = allUnitsQuery.eq('facility_id', profile.facility_id);
      }

      const { data: allUnitsData } = await allUnitsQuery;

      // Create a map of occupied units for quick lookup
      const occupiedUnitsMap = new Map();
      occupiedUnitsData?.forEach(unit => {
        const activeRental = unit.unit_rentals?.find(rental => rental.is_active === true);
        if (activeRental) {
          occupiedUnitsMap.set(unit.id, {
            rental: activeRental,
            customer: activeRental.customer
          });
        }
      });

      // Transform all units data
      const transformedUnits = allUnitsData?.map(unit => {
        const occupiedInfo = occupiedUnitsMap.get(unit.id);
        let unitStatus = unit.status;
        let customerName = null;
        let customerId = null;
        
        if (occupiedInfo) {
          // Unit has an active rental
          unitStatus = 'occupied';
          const customer = occupiedInfo.customer;
          
          // Build customer name from available data
          const firstName = customer?.first_name || '';
          const lastName = customer?.last_name || '';
          
          if (firstName || lastName) {
            customerName = `${firstName} ${lastName}`.trim();
          } else if (customer?.emergency_contact_name) {
            customerName = customer.emergency_contact_name;
          } else if (customer?.email) {
            customerName = customer.email;
          } else {
            customerName = 'Unknown Customer';
          }
          
          customerId = customer?.user_id || customer?.id;
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

      // Fetch customers with their unit relationships
      let customersQuery = supabase
        .from('customers')
        .select(`
          *,
          unit_rentals(
            *,
            unit:units(unit_number, facility_id, size, type, monthly_rate)
          )
        `);

      // Apply tenant filtering for customers
      if (profile.role === 'admin') {
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
        customersQuery = customersQuery.eq('facility_id', profile.facility_id);
      }

      const { data: customersData } = await customersQuery;

      // Transform customers and build customer-unit mapping
      const customerUnitsMap: Record<string, string[]> = {};
      const transformedCustomers = customersData?.map((customer: any) => {
        // Get active unit rentals for this customer
        const activeRentals = customer.unit_rentals?.filter((rental: any) => rental.is_active) || [];
        const customerUnitNumbers = activeRentals.map((rental: any) => rental.unit?.unit_number).filter(Boolean);
        
        // Store customer-unit relationship
        customerUnitsMap[customer.id] = customerUnitNumbers;
        
        return {
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
        };
      }) || [];

      setUnits(transformedUnits);
      setCustomers(transformedCustomers);
      setCustomerUnits(customerUnitsMap);

      // Fetch facilities based on tenant access
      let facilitiesQuery = supabase.from('facilities').select('*');
      
      if (profile.role === 'admin') {
        const { data: userFacility } = await supabase
          .from('facilities')
          .select('tenant_id')
          .eq('id', profile.facility_id)
          .single();
        
        if (userFacility?.tenant_id) {
          facilitiesQuery = facilitiesQuery.eq('tenant_id', userFacility.tenant_id);
        }
      } else {
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
    customerUnits,
    loading,
    addUnit,
    updateUnit,
    addCustomer,
    refreshData: fetchData
  };
};
