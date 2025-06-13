import type { Unit } from "@/hooks/useAppState";
import { DatabaseCustomer, CustomerDetails } from "@/types/customer";

/**
 * Unified unit transformation for both floor plan and details views
 * Transforms Unit from useAppState to the common unit interface used by UI components
 */
export const transformUnit = (unit: Unit) => {
  if (!unit) {
    return null;
  }

  try {
    return {
      id: unit.id || '',
      size: unit.size || '',
      type: unit.type || 'Standard',
      status: unit.status || 'available',
      tenant: unit.tenant?.name || null,
      tenantId: unit.tenant?.id || null,
      rate: unit.monthly_rate || 0,
      climate: unit.climate_controlled || false,
      site: unit.facility_id || ''
    };
  } catch (error) {
    console.error('Error transforming unit:', error);
    return null;
  }
};

/**
 * Transform multiple units with null filtering
 */
export const transformUnits = (units: Unit[]) => {
  return (units || [])
    .map(transformUnit)
    .filter(unit => unit !== null);
};

/**
 * Transform database customer to CustomerDetails format with proper unit information
 */
export const transformCustomerToCustomerDetails = (customer: DatabaseCustomer): CustomerDetails => {
  if (!customer) {
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      ssn: '',
      status: 'active',
      joinDate: '',
      units: []
    };
  }

  try {
    // Get units from customer.active_units if available
    const units = customer.active_units?.map(unitInfo => ({
      unitId: unitInfo.rental_id || `rental-${unitInfo.unit_number}`,
      unitNumber: unitInfo.unit_number || '',
      status: 'good' as const,
      monthlyRate: Number(unitInfo.monthly_rate) || 0,
      leaseStart: unitInfo.start_date || new Date().toISOString().split('T')[0],
      leaseEnd: undefined,
      balance: customer.balance || 0
    })) || [];

    return {
      id: customer.id || '',
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown',
      email: customer.email || '',
      phone: customer.phone || '',
      address: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zip_code || ''}`.trim(),
      ssn: customer.ssn || '',
      status: customer.status || 'active',
      joinDate: customer.move_in_date || customer.join_date || new Date().toISOString().split('T')[0],
      units: units
    };
  } catch (error) {
    console.error('Error transforming customer to CustomerDetails:', error);
    return {
      id: customer.id || '',
      name: 'Error',
      email: '',
      phone: '',
      address: '',
      ssn: '',
      status: 'active',
      joinDate: '',
      units: []
    };
  }
};

/**
 * Transform unit updates from UI components back to useAppState format
 */
export const transformUpdatedUnit = (originalUnit: Unit, updatedUnit: { rate: number; climate: boolean; status: string }) => {
  return {
    ...originalUnit,
    monthly_rate: updatedUnit.rate,
    climate_controlled: updatedUnit.climate,
    status: updatedUnit.status
  };
};

/**
 * Transform new unit from UI to useAppState format
 */
export const transformNewUnit = (newUnit: { 
  id: string; 
  size: string; 
  rate: number; 
  status: string; 
  type: string; 
  climate: boolean; 
  site: string; 
  tenant?: string; 
  tenantId?: string; 
}) => {
  return {
    id: newUnit.id,
    unit_number: newUnit.id,
    size: newUnit.size,
    monthly_rate: newUnit.rate,
    status: newUnit.status,
    type: newUnit.type,
    climate_controlled: newUnit.climate,
    facility_id: newUnit.site,
    tenant: newUnit.tenant ? {
      id: newUnit.tenantId || '',
      name: newUnit.tenant,
      phone: '',
      email: ''
    } : undefined
  };
};