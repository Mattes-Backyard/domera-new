
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { UnitGrid } from "@/components/units/UnitGrid";
import { CustomerList } from "@/components/customers/CustomerList";
import { OperationsView } from "@/components/operations/OperationsView";
import { UnitDetailsPage } from "@/components/units/UnitDetailsPage";
import { TenantDetailsPage } from "@/components/tenants/TenantDetailsPage";
import { AddUnitDialog } from "@/components/units/AddUnitDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUnits, useAddUnit, useUpdateUnit, type Unit } from "@/hooks/useUnits";
import { useCustomers, useAddCustomer, type Customer } from "@/hooks/useCustomers";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [viewingTenantDetails, setViewingTenantDetails] = useState<Customer | null>(null);
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false);

  // Use Supabase data
  const { data: units = [], isLoading: unitsLoading } = useUnits();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const addUnitMutation = useAddUnit();
  const updateUnitMutation = useUpdateUnit();
  const addCustomerMutation = useAddCustomer();

  const handleAddUnit = (newUnit: Unit) => {
    addUnitMutation.mutate(newUnit);
  };

  const handleTenantClick = (tenantId: string) => {
    const customer = customers.find(c => c.id === tenantId);
    if (customer) {
      setViewingTenantDetails(customer);
      setActiveView("customers");
    }
  };

  const handleSearchResultClick = (type: 'unit' | 'customer', id: string) => {
    if (type === 'unit') {
      const unit = units.find(u => u.id === id);
      if (unit) {
        setViewingUnitDetails(unit);
        setActiveView("units");
      }
    } else if (type === 'customer') {
      const customer = customers.find(c => c.id === id);
      if (customer) {
        setViewingTenantDetails(customer);
        setActiveView("customers");
      }
    }
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    addCustomerMutation.mutate(newCustomer);
  };

  const handleUnitUpdate = (updatedUnit: Unit) => {
    updateUnitMutation.mutate(updatedUnit);
    
    // Update the viewing details with the updated unit
    if (viewingUnitDetails) {
      setViewingUnitDetails(updatedUnit);
    }
  };

  const handleQuickAddUnit = () => {
    setShowAddUnitDialog(true);
  };

  // Enhanced navigation handler that clears any detail views
  const handleNavigationChange = (view: string) => {
    setActiveView(view);
    setViewingUnitDetails(null);
    setViewingTenantDetails(null);
    setSelectedUnitId(null);
    setSelectedCustomerId(null);
  };

  // Show loading state
  if (unitsLoading || customersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const renderContent = () => {
    if (viewingUnitDetails) {
      return (
        <UnitDetailsPage 
          unit={viewingUnitDetails} 
          onBack={() => setViewingUnitDetails(null)}
          onUnitUpdate={handleUnitUpdate}
        />
      );
    }

    if (viewingTenantDetails) {
      // Convert customer to tenant format with synced units
      const tenant = {
        ...viewingTenantDetails,
        address: viewingTenantDetails.address || "Orkestergatan 7, Tomelilla, Sweden, 27397",
        ssn: viewingTenantDetails.ssn || "195210043912",
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
          onBack={() => setViewingTenantDetails(null)}
        />
      );
    }

    switch (activeView) {
      case "units":
        return (
          <UnitGrid 
            searchQuery={searchQuery} 
            selectedUnitId={selectedUnitId} 
            onClearSelection={() => setSelectedUnitId(null)} 
            units={units}
            onUnitSelect={(unit) => setViewingUnitDetails(unit)}
            onUnitAdd={handleAddUnit}
            triggerAddDialog={false}
            onAddDialogClose={() => {}}
            onTenantClick={handleTenantClick}
          />
        );
      case "customers":
        return (
          <CustomerList 
            selectedCustomerId={selectedCustomerId} 
            onClearSelection={() => setSelectedCustomerId(null)} 
            customers={customers} 
            onAddCustomer={handleAddCustomer}
            onViewDetails={(customer) => setViewingTenantDetails(customer)}
            triggerAddDialog={false}
            onAddDialogClose={() => {}}
          />
        );
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
                onAddUnit={handleQuickAddUnit}
                onAddCustomer={handleAddCustomer}
              />
              <AIInsights />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <DashboardSidebar activeView={activeView} setActiveView={handleNavigationChange} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery}
            onSearchResultClick={handleSearchResultClick}
            units={units}
            customers={customers}
          />
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
        
        {/* Global Add Unit Dialog */}
        <AddUnitDialog
          isOpen={showAddUnitDialog}
          onClose={() => setShowAddUnitDialog(false)}
          onSave={handleAddUnit}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
