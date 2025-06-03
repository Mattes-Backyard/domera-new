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
import { IntegrationsView } from "@/components/integrations/IntegrationsView";
import { BillingView } from "@/components/billing/BillingView";
import { ReservationSystem } from "@/components/reservations/ReservationSystem";
import { PaymentProcessor } from "@/components/payments/PaymentProcessor";
import { AccessControlPanel } from "@/components/access/AccessControlPanel";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { AdminInterface } from "@/components/admin/AdminInterface";
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
  selectedSites?: string[];
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
  selectedSites = ["helsingborg"],
}: ContentRendererProps) => {
  const handleUnitsUpdate = (updatedUnits: Unit[]) => {
    // Apply each unit update individually to maintain proper state sync
    updatedUnits.forEach(unit => {
      const originalUnit = units.find(u => u.id === unit.id);
      if (originalUnit && JSON.stringify(originalUnit) !== JSON.stringify(unit)) {
        onUnitUpdate(unit);
      }
    });
  };

  const handleReserveUnit = (unitId: string, reservation: any) => {
    console.log("Unit reserved:", unitId, reservation);
    // Handle reservation logic here
  };

  const handlePaymentComplete = (paymentData: any) => {
    console.log("Payment completed:", paymentData);
    // Handle payment completion logic here
  };

  const handleAccessMethodAssigned = (method: string, code: string) => {
    console.log("Access method assigned:", method, code);
    // Handle access method assignment logic here
  };

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

  if (activeView === "admin") {
    return <AdminInterface />;
  }

  if (activeView === "reservations") {
    return (
      <ReservationSystem 
        units={units} 
        onReserveUnit={handleReserveUnit}
      />
    );
  }

  if (activeView === "access-control") {
    return (
      <AccessControlPanel 
        onAccessMethodAssigned={handleAccessMethodAssigned}
      />
    );
  }

  if (activeView === "reports") {
    return <ReportsDashboard />;
  }

  switch (activeView) {
    case "billing":
      return <BillingView />;
    case "integrations":
      return <IntegrationsView />;
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
      return <OperationsView 
        units={units} 
        onTenantClick={onTenantClick} 
        onUnitsUpdate={handleUnitsUpdate}
        selectedSites={selectedSites}
      />;
    case "dashboard":
    default:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-full">
          <div className="lg:col-span-8 space-y-6">
            <OverviewStats />
            <OccupancyChart units={units} />
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
