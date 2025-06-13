
import { UnitGrid } from "@/components/units/UnitGrid";
import { CustomerList } from "@/components/customers/CustomerList";
import { UnitDetailsPage } from "@/components/units/UnitDetailsPage";
import { CustomerDetailsPage } from "@/components/customers/CustomerDetailsPage";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { TasksView } from "@/components/tasks/TasksView";
import { BillingView } from "@/components/billing/BillingView";
import { OperationsView } from "@/components/operations/OperationsView";
import { FloorPlanView } from "@/components/floor-plan/FloorPlanView";
import { AdminInterface } from "@/components/admin/AdminInterface";
import { IntegrationsView } from "@/components/integrations/IntegrationsView";
import { ProfileView } from "@/components/profile/ProfileView";
import { Customer, DatabaseCustomer, transformCustomerToDatabaseCustomer } from "@/types/customer";
import type { Unit } from "@/hooks/useAppState";
import type { Database } from "@/integrations/supabase/types";
import { 
  transformUnit, 
  transformUnits, 
  transformCustomerToCustomerDetails,
  transformUpdatedUnit,
  transformNewUnit
} from "@/utils/contentTransformations";
import { ErrorFallback, ViewContainer, ViewErrorFallback } from "@/utils/errorHandling";
import { withErrorHandling } from "@/utils/errorUtils";

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
  onCustomerClick: (customerId: string) => void;
  customerUnits?: Record<string, string[]>;
}

// Helper function to ensure proper status typing
const ensureUnitStatus = (status: string): Database["public"]["Enums"]["unit_status"] => {
  const validStatuses: Database["public"]["Enums"]["unit_status"][] = ["available", "occupied", "reserved", "maintenance"];
  return validStatuses.includes(status as Database["public"]["Enums"]["unit_status"]) 
    ? (status as Database["public"]["Enums"]["unit_status"])
    : "available";
};

// Render helper functions for each view type
const renderFloorPlan = (props: {
  units: Unit[];
  onBackFromFloorPlan: () => void;
  onUnitSelect: (unit: Unit) => void;
  onUnitUpdate: (unit: Unit) => void;
}) => {
  const { units, onBackFromFloorPlan, onUnitSelect, onUnitUpdate } = props;
  const transformedUnitsForFloorPlan = transformUnits(units);

  return (
    <ViewContainer>
      <FloorPlanView 
        units={transformedUnitsForFloorPlan}
        onBack={onBackFromFloorPlan}
        onUnitClick={(unit) => {
          const originalUnit = units?.find?.(u => u.id === unit.id);
          if (originalUnit) {
            onUnitSelect({
              ...originalUnit,
              status: ensureUnitStatus(originalUnit.status)
            });
          }
        }}
        onUnitUpdate={(updatedUnit) => {
          const originalUnit = units?.find?.(u => u.id === updatedUnit.id);
          if (originalUnit) {
            const transformedUnit = transformUpdatedUnit(originalUnit, updatedUnit);
            onUnitUpdate({
              ...transformedUnit,
              status: ensureUnitStatus(transformedUnit.status)
            });
          }
        }}
      />
    </ViewContainer>
  );
};

const renderUnitDetails = (props: {
  viewingUnitDetails: Unit;
  onBackFromUnit: () => void;
  onUnitUpdate: (unit: Unit) => void;
  customers: DatabaseCustomer[];
  facilities: Facility[];
}) => {
  const { viewingUnitDetails, onBackFromUnit, onUnitUpdate, customers, facilities } = props;
  const transformedUnit = transformUnit(viewingUnitDetails);
  
  if (!transformedUnit) {
    return <ErrorFallback onBack={onBackFromUnit} />;
  }

  return (
    <ViewContainer>
      <UnitDetailsPage
        unit={transformedUnit}
        onBack={onBackFromUnit}
        onUnitUpdate={(updatedUnit) => {
          const transformedBack = transformUpdatedUnit(viewingUnitDetails, updatedUnit);
          onUnitUpdate({
            ...transformedBack,
            status: ensureUnitStatus(transformedBack.status)
          });
        }}
        customers={customers}
        facilities={facilities}
      />
    </ViewContainer>
  );
};

const renderCustomerDetails = (props: {
  viewingTenantDetails: DatabaseCustomer;
  onBackFromTenant: () => void;
}) => {
  const { viewingTenantDetails, onBackFromTenant } = props;
  const transformedCustomer = transformCustomerToCustomerDetails(viewingTenantDetails);
  
  return (
    <ViewContainer>
      <CustomerDetailsPage
        customer={transformedCustomer}
        onBack={onBackFromTenant}
      />
    </ViewContainer>
  );
};

const renderUnitsView = (props: {
  searchQuery: string;
  selectedUnitId: string | null;
  onClearUnitSelection: () => void;
  units: Unit[];
  onUnitSelect: (unit: Unit) => void;
  onUnitAdd: (unit: Unit) => void;
  onTenantClick: (tenantId: string) => void;
  facilities: Facility[];
}) => {
  const { 
    searchQuery, selectedUnitId, onClearUnitSelection, units, 
    onUnitSelect, onUnitAdd, onTenantClick, facilities 
  } = props;
  const transformedUnitsForFloorPlan = transformUnits(units);

  return (
    <ViewContainer>
      <UnitGrid
        searchQuery={searchQuery}
        selectedUnitId={selectedUnitId}
        onClearSelection={onClearUnitSelection}
        units={transformedUnitsForFloorPlan}
        onUnitSelect={(unit) => {
          const originalUnit = units?.find?.(u => u.id === unit.id);
          if (originalUnit) {
            onUnitSelect({
              ...originalUnit,
              status: ensureUnitStatus(originalUnit.status)
            });
          }
        }}
        onUnitAdd={(newUnit) => {
          try {
            const transformedBack = transformNewUnit(newUnit);
            onUnitAdd({
              ...transformedBack,
              status: ensureUnitStatus(transformedBack.status)
            });
          } catch (error) {
            console.error('Error adding unit:', error);
          }
        }}
        onTenantClick={onTenantClick}
        facilities={facilities || []}
      />
    </ViewContainer>
  );
};

const renderCustomersView = (props: {
  searchQuery: string;
  selectedCustomerId: string | null;
  onClearCustomerSelection: () => void;
  customers: DatabaseCustomer[];
  onCustomerAdd: (customer: DatabaseCustomer) => void;
  onCustomerClick: (customerId: string) => void;
  customerUnits: Record<string, string[]>;
  facilities: Facility[];
}) => {
  const { 
    searchQuery, selectedCustomerId, onClearCustomerSelection, customers,
    onCustomerAdd, onCustomerClick, customerUnits, facilities 
  } = props;

  return (
    <ViewContainer>
      <CustomerList
        searchQuery={searchQuery}
        selectedCustomerId={selectedCustomerId}
        onClearSelection={onClearCustomerSelection}
        customers={customers}
        onCustomerAdd={onCustomerAdd}
        onCustomerClick={onCustomerClick}
        customerUnits={customerUnits}
        facilities={facilities}
      />
    </ViewContainer>
  );
};

const renderOperationsView = (props: {
  units: Unit[];
  onTenantClick: (tenantId: string) => void;
  selectedSites: string[];
}) => {
  const { units, onTenantClick, selectedSites } = props;
  const transformedUnitsForFloorPlan = transformUnits(units);

  return (
    <ViewContainer>
      <OperationsView
        units={transformedUnitsForFloorPlan}
        onTenantClick={onTenantClick}
        selectedSites={selectedSites}
      />
    </ViewContainer>
  );
};

const renderSimpleView = (Component: React.ComponentType) => (
  <ViewContainer>
    <Component />
  </ViewContainer>
);

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
  onCustomerClick,
  customerUnits = {},
}: ContentRendererProps) => {
  // Safely transform Customer[] to DatabaseCustomer[] for CustomerList
  const databaseCustomers = customers?.map?.(transformCustomerToDatabaseCustomer) || [];

  // Show floor plan if requested
  if (showFloorPlan) {
    return withErrorHandling(renderFloorPlan, <ViewErrorFallback />)({
      units,
      onBackFromFloorPlan,
      onUnitSelect,
      onUnitUpdate
    });
  }

  // Show unit details if viewing a specific unit
  if (viewingUnitDetails) {
    return withErrorHandling(renderUnitDetails, <ViewErrorFallback />)({
      viewingUnitDetails,
      onBackFromUnit,
      onUnitUpdate,
      customers: databaseCustomers,
      facilities
    });
  }

  // Show customer details if viewing a specific customer
  if (viewingTenantDetails) {
    return withErrorHandling(renderCustomerDetails, <ViewErrorFallback />)({
      viewingTenantDetails,
      onBackFromTenant
    });
  }

  // Regular view rendering with proper error handling
  return withErrorHandling(() => {
    switch (activeView) {
      case "dashboard":
      case "reports":
        return renderSimpleView(ReportsDashboard);
      
      case "units":
        return renderUnitsView({
          searchQuery,
          selectedUnitId,
          onClearUnitSelection,
          units,
          onUnitSelect,
          onUnitAdd,
          onTenantClick,
          facilities
        });
      
      case "customers":
        return renderCustomersView({
          searchQuery,
          selectedCustomerId,
          onClearCustomerSelection,
          customers: databaseCustomers,
          onCustomerAdd,
          onCustomerClick,
          customerUnits,
          facilities
        });
      
      case "tasks":
        return renderSimpleView(TasksView);
      
      case "billing":
        return renderSimpleView(BillingView);
      
      case "operations":
        return renderOperationsView({
          units,
          onTenantClick,
          selectedSites
        });
      
      case "admin":
        return renderSimpleView(AdminInterface);
      
      case "integrations":
        return renderSimpleView(IntegrationsView);
      
      case "profile":
        return renderSimpleView(ProfileView);
      
      default:
        return renderSimpleView(ReportsDashboard);
    }
  }, <ViewErrorFallback />)();
};
