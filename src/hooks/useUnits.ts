
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  rate: number;
  climate_controlled: boolean;
  tenant?: string | null;
  tenantId?: string | null;
}

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      console.log('Fetching units from Supabase...');
      
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('*');
      
      if (unitsError) {
        console.error('Error fetching units:', unitsError);
        throw unitsError;
      }

      const { data: assignments, error: assignmentsError } = await supabase
        .from('unit_assignments')
        .select(`
          unit_id,
          customer_id,
          customers (
            name
          )
        `);

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        throw assignmentsError;
      }

      // Map units with tenant information
      const unitsWithTenants = units.map(unit => {
        const assignment = assignments.find(a => a.unit_id === unit.id);
        return {
          id: unit.id,
          size: unit.size,
          type: unit.type,
          status: unit.status,
          rate: Number(unit.rate),
          climate: unit.climate_controlled,
          tenant: assignment?.customers?.name || null,
          tenantId: assignment?.customer_id || null,
        };
      });

      console.log('Fetched units:', unitsWithTenants);
      return unitsWithTenants;
    },
  });
};

export const useAddUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newUnit: Omit<Unit, 'tenant' | 'tenantId'>) => {
      console.log('Adding unit to Supabase:', newUnit);
      
      const { data, error } = await supabase
        .from('units')
        .insert({
          id: newUnit.id,
          size: newUnit.size,
          type: newUnit.type,
          status: newUnit.status,
          rate: newUnit.rate,
          climate_controlled: newUnit.climate,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding unit:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedUnit: Unit) => {
      console.log('Updating unit in Supabase:', updatedUnit);
      
      const { data, error } = await supabase
        .from('units')
        .update({
          size: updatedUnit.size,
          type: updatedUnit.type,
          status: updatedUnit.status,
          rate: updatedUnit.rate,
          climate_controlled: updatedUnit.climate,
        })
        .eq('id', updatedUnit.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating unit:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};
