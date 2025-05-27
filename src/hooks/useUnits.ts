
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  rate: number;
  climate_controlled: boolean;
  tenant_id: string | null;
  tenant?: string | null;
  tenantId?: string | null;
}

export const useUnits = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          customers (
            name
          )
        `);

      if (error) throw error;

      const unitsWithTenant = data.map(unit => ({
        ...unit,
        tenant: unit.customers?.name || null,
        tenantId: unit.tenant_id
      }));

      setUnits(unitsWithTenant);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: "Error",
        description: "Failed to fetch units",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUnit = async (newUnit: Omit<Unit, "tenant" | "tenantId">) => {
    try {
      const { data, error } = await supabase
        .from('units')
        .insert({
          id: newUnit.id,
          size: newUnit.size,
          type: newUnit.type,
          status: newUnit.status,
          rate: newUnit.rate,
          climate_controlled: newUnit.climate_controlled,
          tenant_id: newUnit.tenant_id
        })
        .select()
        .single();

      if (error) throw error;

      const unitWithTenant = {
        ...data,
        tenant: null,
        tenantId: data.tenant_id
      };

      setUnits(prev => [...prev, unitWithTenant]);
      
      toast({
        title: "Success",
        description: "Unit added successfully",
      });

      return unitWithTenant;
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Error",
        description: "Failed to add unit",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUnit = async (updatedUnit: Unit) => {
    try {
      const { data, error } = await supabase
        .from('units')
        .update({
          size: updatedUnit.size,
          type: updatedUnit.type,
          status: updatedUnit.status,
          rate: updatedUnit.rate,
          climate_controlled: updatedUnit.climate_controlled,
          tenant_id: updatedUnit.tenant_id
        })
        .eq('id', updatedUnit.id)
        .select(`
          *,
          customers (
            name
          )
        `)
        .single();

      if (error) throw error;

      const unitWithTenant = {
        ...data,
        tenant: data.customers?.name || null,
        tenantId: data.tenant_id
      };

      setUnits(prev => prev.map(unit => 
        unit.id === updatedUnit.id ? unitWithTenant : unit
      ));

      toast({
        title: "Success",
        description: "Unit updated successfully",
      });

      return unitWithTenant;
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "Error",
        description: "Failed to update unit",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return {
    units,
    loading,
    addUnit,
    updateUnit,
    refetch: fetchUnits
  };
};
