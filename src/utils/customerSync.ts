
import type { Unit, Customer } from "@/hooks/useAppState";

export const syncCustomerUnits = (
  updatedUnits: Unit[], 
  updatedCustomers: Customer[],
  setCustomers: (customers: Customer[]) => void,
  viewingTenantDetails: Customer | null,
  setViewingTenantDetails: (customer: Customer | null) => void
) => {
  const syncedCustomers = updatedCustomers.map(customer => {
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
