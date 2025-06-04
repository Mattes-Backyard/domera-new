
import { UnitGrid } from "@/components/units/UnitGrid";
import { CustomerList } from "@/components/customers/CustomerList";
import { UnitDetailsPage } from "@/components/units/UnitDetailsPage";
import { TenantDetailsPage } from "@/components/tenants/TenantDetailsPage";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { TasksView } from "@/components/tasks/TasksView";
import { BillingView } from "@/components/billing/BillingView";
import { OperationsView } from "@/components/operations/OperationsView";
import { FloorPlanView } from "@/components/floor-plan/FloorPlanView";
import { AdminInterface } from "@/components/admin/AdminInterface";
import { IntegrationsView } from "@/components/integrations/IntegrationsView";
import { Customer, DatabaseCustomer, transformCustomerToDatabaseCustomer, Tenant } from "@/types/customer";
import type { Unit } from "@/hooks/useAppState";

interface Facility {
  id: string;
  name: string;
}

interface ContentRendererProps {
  activeView: string;
  searchQuery: string;
  selectedUnitId: string | null;
  selectedCustomerId: string | null;
  viewingUnitDetails: Unit | null;
  viewingTenantDetails: DatabaseCustomer | null;
  showFloorPlan: boolean;
  units: Unit[];
  customers: Customer[];
  facilities: Facility[];
  onUnitSelect: (unit: Unit) => void;
  onUnitUpdate: (unit: Unit) => void;
  onUnitAdd: (unit: Unit) => void;
  onCustomerAdd: (customer: DatabaseCustomer) => void;
  onTenantClick: (tenantId: string) => void;
  onClearUnitSelection: () => void;
  onClearCustomerSelection: () => void;
  onBackFromUnit: () => void;
  onBackFromTenant: () => void;
  onBackFromFloorPlan: () => void;
  onQuickAddUnit: () => void;
  selectedSites: string[];
}

// Transform Unit from useAppState to FloorPlanView Unit interface
const transformUnitForFloorPlan = (unit: Unit) => {
  return {
    id: unit.id,
    size: unit.size,
    type: unit.type || 'Standard',
    status: unit.status,
    tenant: unit.tenant?.name || null,
    tenantId: unit.tenant?.id || null,
    rate: unit.monthly_rate,
    climate: unit.climate_controlled || false,
    site: unit.facility_id
  };
};

// Transform Unit from useAppState to UnitDetailsPage Unit interface
const transformUnitForDetails = (unit: Unit) => {
  return {
    id: unit.id,
    size: unit.size,
    type: unit.type || 'Standard',
    status: unit.status,
    tenant: unit.tenant?.name || null,
    tenantId: unit.tenant?.id || null,
    rate: unit.monthly_rate,
    climate: unit.climate_controlled || false,
    site: unit.facility_id
  };
};

// Transform database customer to tenant format for TenantDetailsPage
const transformCustomerToTenant = (customer: DatabaseCustomer): Tenant => {
  return {
    id: customer.id,
    name: `${customer.first_name} ${customer.last_name}`,
    email: customer.email,
    phone: customer.phone,
    address: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip_code}`,
    ssn: "", // Not available in current customer data
    status: "active", // Default status
    joinDate: customer.move_in_date || new Date().toISOString().split('T')[0],
    units: [] // Would need to be populated from unit rentals
  };
};

export const ContentRenderer = ({
  activeView,
  searchQuery,
  selectedUnitId,
  selectedCustomerId,
  viewingUnitDetails,
  viewingTenantDetails,
  showFloorPlan,
  units,
  customers,
  facilities,
  onUnitSelect,
  onUnitUpdate,
  onUnitAdd,
  onCustomerAdd,
  onTenantClick,
  onClearUnitSelection,
  onClearCustomerSelection,
  onBackFromUnit,
  onBackFromTenant,
  onBackFromFloorPlan,
  onQuickAddUnit,
  selectedSites,
}: ContentRendererProps) => {
  // Transform Customer[] to DatabaseCustomer[] for CustomerList
  const databaseCustomers = customers.map(transformCustomerToDatabaseCustomer);

  // Transform units for floor plan view
  const transformedUnitsForFloorPlan = units.map(transformUnitForFloorPlan);

  // Show floor plan if requested
  if (showFloorPlan) {
    return (
      <div className="h-full overflow-auto">
        <FloorPlanView 
          units={transformedUnitsForFloorPlan}
          onBack={onBackFromFloorPlan}
          onUnitClick={(unit) => {
            // Find original unit and call onUnitSelect
            const originalUnit = units.find(u => u.id === unit.id);
            if (originalUnit) {
              onUnitSelect(originalUnit);
            }
          }}
          onUnitUpdate={(updatedUnit) => {
            // Find original unit and transform back
            const originalUnit = units.find(u => u.id === updatedUnit.id);
            if (originalUnit) {
              const transformedUnit = {
                ...originalUnit,
                monthly_rate: updatedUnit.rate,
                climate_controlled: updatedUnit.climate,
                status: updatedUnit.status as any
              };
              onUnitUpdate(transformedUnit);
            }
          }}
        />
      </div>
    );
  }

  // Show unit details if viewing a specific unit
  if (viewingUnitDetails) {
    const transformedUnit = transformUnitForDetails(viewingUnitDetails);
    return (
      <div className="h-full overflow-auto">
        <UnitDetailsPage
          unit={transformedUnit}
          onBack={onBackFromUnit}
          onUnitUpdate={(updatedUnit) => {
            // Transform back to useAppState Unit format
            const transformedBack = {
              ...viewingUnitDetails,
              monthly_rate: updatedUnit.rate,
              climate_controlled: updatedUnit.climate,
              status: updatedUnit.status as any
            };
            onUnitUpdate(transformedBack);
          }}
          customers={databaseCustomers}
          facilities={facilities}
        />
      </div>
    );
  }

  // Show tenant details if viewing a specific tenant
  if (viewingTenantDetails) {
    const transformedTenant = transformCustomerToTenant(viewingTenantDetails);
    return (
      <div className="h-full overflow-auto">
        <TenantDetailsPage
          tenant={transformedTenant}
          onBack={onBackFromTenant}
        />
      </div>
    );
  }

  // Regular view rendering with proper scrolling containers
  switch (activeView) {
    case "dashboard":
      return (
        <div className="h-full overflow-auto">
          <ReportsDashboard />
        </div>
      );
    case "units":
      return (
        <div className="h-full overflow-auto">
          <UnitGrid
            searchQuery={searchQuery}
            selectedUnitId={selectedUnitId}
            onClearSelection={onClearUnitSelection}
            units={transformedUnitsForFloorPlan}
            onUnitSelect={(unit) => {
              // Find original unit and call onUnitSelect
              const originalUnit = units.find(u => u.id === unit.id);
              if (originalUnit) {
                onUnitSelect(originalUnit);
              }
            }}
            onUnitAdd={(newUnit) => {
              // Transform back to useAppState Unit format
              const transformedBack = {
                id: newUnit.id,
                unit_number: newUnit.id,
                size: newUnit.size,
                monthly_rate: newUnit.rate,
                status: newUnit.status as any,
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
              onUnitAdd(transformedBack);
            }}
            onTenantClick={onTenantClick}
            facilities={facilities}
          />
        </div>
      );
    case "customers":
      return (
        <div className="h-full overflow-auto">
          <CustomerList
            searchQuery={searchQuery}
            selectedCustomerId={selectedCustomerId}
            onClearSelection={onClearCustomerSelection}
            customers={databaseCustomers}
            onCustomerAdd={onCustomerAdd}
            onTenantClick={onTenantClick}
          />
        </div>
      );
    case "reports":
      return (
        <div className="h-full overflow-auto">
          <ReportsDashboard />
        </div>
      );
    case "tasks":
      return (
        <div className="h-full overflow-auto">
          <TasksView />
        </div>
      );
    case "billing":
      return (
        <div className="h-full overflow-auto">
          <BillingView />
        </div>
      );
    case "operations":
      return (
        <div className="h-full overflow-auto">
          <OperationsView
            units={transformedUnitsForFloorPlan}
            onTenantClick={onTenantClick}
            selectedSites={selectedSites}
          />
        </div>
      );
    case "admin":
      return (
        <div className="h-full overflow-auto">
          <AdminInterface />
        </div>
      );
    case "integrations":
      return (
        <div className="h-full overflow-auto">
          <IntegrationsView />
        </div>
      );
    default:
      return (
        <div className="h-full overflow-auto">
          <ReportsDashboard />
        </div>
      );
  }
};
