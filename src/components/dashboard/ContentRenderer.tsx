
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { UnitGrid } from "@/components/units/UnitGrid";
import { CustomerList } from "@/components/customers/CustomerList";
import { OperationsView } from "@/components/operations/OperationsView";
import { TasksView } from "@/components/tasks/TasksView";
import { UnitDetailsPage } from "@/components/units/UnitDetailsPage";
import { TenantDetailsPage } from "@/components/tenants/TenantDetailsPage";
import { FloorPlanView } from "@/components/floor-plan/FloorPlanView";
import type { Unit, Customer } from "@/hooks/useAppState";

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
}

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
}: ContentRendererProps) => {
  if (showFloorPlan) {
    return (
      <FloorPlanView 
        units={units} 
        onBack={onBackFromFloorPlan}
        onUnitUpdate={onUnitUpdate}
      />
    );
  }

  if (viewingUnitDetails) {
    return (
      <UnitDetailsPage 
        unit={viewingUnitDetails} 
        onBack={onBackFromUnit}
        onUnitUpdate={onUnitUpdate}
      />
    );
  }

  if (viewingTenantDetails) {
    // Convert customer to tenant format with synced units
    const tenant = {
      ...viewingTenantDetails,
      address: "Orkestergatan 7, Tomelilla, Sweden, 27397",
      ssn: "195210043912",
      units: viewingTenantDetails.units.map(unitId => {
        const unit = units.find(u => u.id === unitId);
        return {
          unitId,
          unitNumber: unitId,
          status: viewingTenantDetails.balance > 0 ? "overdue" as const : "good" as const,
          monthlyRate: unit?.rate || 678,
          leaseStart: "2024-11-01",
          balance: viewingTenantDetails.balance
        };
      })
    };

    return (
      <TenantDetailsPage 
        tenant={tenant} 
        onBack={onBackFromTenant}
      />
    );
  }

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
          triggerAddDialog={false}
          onAddDialogClose={() => {}}
          onTenantClick={onTenantClick}
        />
      );
    case "customers":
      return (
        <CustomerList 
          selectedCustomerId={selectedCustomerId} 
          onClearSelection={onClearCustomerSelection} 
          customers={customers} 
          onAddCustomer={onCustomerAdd}
          onViewDetails={onTenantClick}
          triggerAddDialog={false}
          onAddDialogClose={() => {}}
        />
      );
    case "tasks":
      return <TasksView units={units} customers={customers} />;
    case "operations":
      return <OperationsView />;
    case "dashboard":
    default:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-full">
          <div className="lg:col-span-8 space-y-6">
            <OverviewStats />
            <OccupancyChart />
            <RecentActivity />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <QuickActions 
              onAddUnit={onQuickAddUnit}
              onAddCustomer={onCustomerAdd}
            />
            <AIInsights />
          </div>
        </div>
      );
  }
};
