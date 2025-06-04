import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useRealtimeSupabaseData = () => {
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
        tenantId: unit.unit_rentals?.[0]?.customer?.user_id || unit.unit_rentals?.[0]?.customer?.id || null,
        rate: Number(unit.monthly_rate),
        climate: unit.climate_controlled,
        site: unit.facility?.city?.toLowerCase() || 'unknown'
      })) || [];

      // Fetch customers - now handle both with and without profiles
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

      // Transform customers data to ensure consistency with unit data
      const transformedCustomers = customersData?.map(customer => {
        // Use profile data if available, otherwise create a placeholder name
        const customerName = customer.profile ? 
          `${customer.profile.first_name || ''} ${customer.profile.last_name || ''}`.trim() : 
          `Customer ${customer.id.slice(-4)}`;
        
        const customerEmail = customer.profile?.email || `customer${customer.id.slice(-4)}@placeholder.com`;
        const customerPhone = customer.profile?.phone || customer.emergency_contact_phone || 'No phone';

        return {
          id: customer.user_id || customer.id,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          units: customer.unit_rentals?.map(rental => rental.unit?.unit_number) || [],
          balance: Number(customer.balance) || 0,
          status: customer.balance > 0 ? 'overdue' : 'good',
          moveInDate: customer.move_in_date,
          emergencyContact: customer.emergency_contact_name,
          emergencyPhone: customer.emergency_contact_phone
        };
      }) || [];

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

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const unitsChannel = supabase
      .channel('units-changes')
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
          fetchData(); // Refetch data when changes occur
        }
      )
      .subscribe();

    const customersChannel = supabase
      .channel('customers-changes')
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
      .subscribe();

    const paymentsChannel = supabase
      .channel('payments-changes')
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
      .subscribe();

    const rentalsChannel = supabase
      .channel('rentals-changes')
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
      .subscribe();

    const maintenanceChannel = supabase
      .channel('maintenance-changes')
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
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks-changes')
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
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(unitsChannel);
      supabase.removeChannel(customersChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(rentalsChannel);
      supabase.removeChannel(maintenanceChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [user]);

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
    loading,
    addUnit,
    updateUnit,
    addCustomer,
    refreshData: fetchData
  };
};
