
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

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
  site: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  lease_end_date?: string;
  security_deposit?: number;
  balance?: number;
  notes?: string;
  facility_id: string;
}

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
  viewingTenantDetails: Customer | null;
  showFloorPlan: boolean;
  units: Unit[];
  customers: Customer[];
  facilities: Facility[];
  onUnitSelect: (unit: Unit) => void;
  onUnitUpdate: (unit: Unit) => void;
  onUnitAdd: (unit: Unit) => void;
  onCustomerAdd: (customer: Customer) => void;
  onTenantClick: (tenantId: string) => void;
  onClearUnitSelection: () => void;
  onClearCustomerSelection: () => void;
  onBackFromUnit: () => void;
  onBackFromTenant: () => void;
  onBackFromFloorPlan: () => void;
  onQuickAddUnit: () => void;
  selectedSites: string[];
}

// Transform database customer to tenant format for TenantDetailsPage
const transformCustomerToTenant = (customer: Customer) => {
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
  // Show floor plan if requested
  if (showFloorPlan) {
    return (
      <FloorPlanView 
        units={units}
        onBack={onBackFromFloorPlan}
        onUnitClick={onUnitSelect}
        onUnitUpdate={onUnitUpdate}
      />
    );
  }

  // Show unit details if viewing a specific unit
  if (viewingUnitDetails) {
    return (
      <UnitDetailsPage
        unit={viewingUnitDetails}
        onBack={onBackFromUnit}
        onUnitUpdate={onUnitUpdate}
        customers={customers}
        facilities={facilities}
      />
    );
  }

  // Show tenant details if viewing a specific tenant
  if (viewingTenantDetails) {
    const transformedTenant = transformCustomerToTenant(viewingTenantDetails);
    return (
      <TenantDetailsPage
        tenant={transformedTenant}
        onBack={onBackFromTenant}
      />
    );
  }

  // Regular view rendering
  switch (activeView) {
    case "units":
      return (
        <UnitGrid
          searchQuery={searchQuery}
          selectedUnitId={selectedUnitId}
          onClearSelection={onClearUnitSelection}
          units={units}
          onUnitSelect={onUnitSelect}
          onUnitAdd={onUnitAdd}
          onTenantClick={onTenantClick}
          facilities={facilities}
        />
      );
    case "customers":
      return (
        <CustomerList
          searchQuery={searchQuery}
          selectedCustomerId={selectedCustomerId}
          onClearSelection={onClearCustomerSelection}
          customers={customers}
          onCustomerAdd={onCustomerAdd}
          onTenantClick={onTenantClick}
        />
      );
    case "reports":
      return <ReportsDashboard />;
    case "tasks":
      return <TasksView onQuickAddUnit={onQuickAddUnit} />;
    case "billing":
      return <BillingView />;
    case "operations":
      return (
        <OperationsView
          units={units}
          onTenantClick={onTenantClick}
          facilities={facilities}
          selectedSites={selectedSites}
        />
      );
    case "admin":
      return <AdminInterface />;
    case "integrations":
      return <IntegrationsView />;
    default:
      return (
        <UnitGrid
          searchQuery={searchQuery}
          selectedUnitId={selectedUnitId}
          onClearSelection={onClearUnitSelection}
          units={units}
          onUnitSelect={onUnitSelect}
          onUnitAdd={onUnitAdd}
          onTenantClick={onTenantClick}
          facilities={facilities}
        />
      );
  }
};
