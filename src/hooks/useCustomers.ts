
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  status: string;
  joinDate: string;
  balance: number;
  address?: string;
  ssn?: string;
}

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      console.log('Fetching customers from Supabase...');
      
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) {
        console.error('Error fetching customers:', customersError);
        throw customersError;
      }

      const { data: assignments, error: assignmentsError } = await supabase
        .from('unit_assignments')
        .select('unit_id, customer_id');

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        throw assignmentsError;
      }

      // Map customers with their assigned units
      const customersWithUnits = customers.map(customer => {
        const customerUnits = assignments
          .filter(a => a.customer_id === customer.id)
          .map(a => a.unit_id);
        
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          units: customerUnits,
          status: customer.status,
          joinDate: customer.join_date,
          balance: Number(customer.balance),
          address: customer.address,
          ssn: customer.ssn,
        };
      });

      console.log('Fetched customers:', customersWithUnits);
      return customersWithUnits;
    },
  });
};

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newCustomer: Omit<Customer, 'units'>) => {
      console.log('Adding customer to Supabase:', newCustomer);
      
      const { data, error } = await supabase
        .from('customers')
        .insert({
          id: newCustomer.id,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          status: newCustomer.status,
          join_date: newCustomer.joinDate,
          balance: newCustomer.balance,
          address: newCustomer.address,
          ssn: newCustomer.ssn,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
