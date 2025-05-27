
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  ssn?: string;
  status: string;
  join_date: string;
  balance: number;
  units?: string[];
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      const { data: customersData, error } = await supabase
        .from('customers')
        .select('*');

      if (error) throw error;

      // Fetch units for each customer
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('id, tenant_id');

      if (unitsError) throw unitsError;

      const customersWithUnits = customersData.map(customer => ({
        ...customer,
        units: unitsData
          .filter(unit => unit.tenant_id === customer.id)
          .map(unit => unit.id)
      }));

      setCustomers(customersWithUnits);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (newCustomer: Omit<Customer, "id" | "units">) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          ssn: newCustomer.ssn,
          status: newCustomer.status,
          join_date: newCustomer.join_date,
          balance: newCustomer.balance
        })
        .select()
        .single();

      if (error) throw error;

      const customerWithUnits = {
        ...data,
        units: []
      };

      setCustomers(prev => [...prev, customerWithUnits]);
      
      toast({
        title: "Success",
        description: "Customer added successfully",
      });

      return customerWithUnits;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    addCustomer,
    refetch: fetchCustomers
  };
};
