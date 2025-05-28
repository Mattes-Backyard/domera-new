
import type { Unit, Customer } from "@/hooks/useAppState";

export const syncCustomerUnits = (
  updatedUnits: Unit[], 
  customers: Customer[],
  setCustomers: (customers: Customer[]) => void,
  viewingTenantDetails: Customer | null,
  setViewingTenantDetails: (customer: Customer | null) => void
) => {
  const syncedCustomers = customers.map(customer => {
    const customerUnits = updatedUnits
      .filter(unit => unit.tenantId === customer.id)
      .map(unit => unit.id);
    
    return {
      ...customer,
      units: customerUnits,
      status: customerUnits.length > 0 ? "active" : customer.status === "active" ? "former" : customer.status
    };
  });
  
  setCustomers(syncedCustomers);
  
  // Update viewing tenant details if currently viewing one
  if (viewingTenantDetails) {
    const updatedTenant = syncedCustomers.find(c => c.id === viewingTenantDetails.id);
    if (updatedTenant) {
      setViewingTenantDetails(updatedTenant);
    }
  }
};

// New function to handle unit updates with automatic customer sync
export const updateUnitWithSync = (
  updatedUnit: Unit,
  units: Unit[],
  customers: Customer[],
  setUnits: (unit: Unit) => void,
  setCustomers: (customers: Customer[]) => void,
  viewingTenantDetails: Customer | null,
  setViewingTenantDetails: (customer: Customer | null) => void
) => {
  // Update the unit
  setUnits(updatedUnit);
  
  // Get the updated units array with the new unit
  const updatedUnits = units.map(unit => 
    unit.id === updatedUnit.id ? updatedUnit : unit
  );
  
  // Sync customer units with the updated units
  syncCustomerUnits(updatedUnits, customers, setCustomers, viewingTenantDetails, setViewingTenantDetails);
};
