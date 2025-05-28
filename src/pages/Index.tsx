
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ContentRenderer } from "@/components/dashboard/ContentRenderer";
import { AddUnitDialog } from "@/components/units/AddUnitDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppState } from "@/hooks/useAppState";
import { syncCustomerUnits } from "@/utils/customerSync";
import type { Unit, Customer } from "@/hooks/useAppState";

const Index = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedUnitId,
    setSelectedUnitId,
    selectedCustomerId,
    setSelectedCustomerId,
    viewingUnitDetails,
    setViewingUnitDetails,
    viewingTenantDetails,
    setViewingTenantDetails,
    showFloorPlan,
    setShowFloorPlan,
    units,
    setUnits,
    customers,
    setCustomers,
    showAddUnitDialog,
    setShowAddUnitDialog,
  } = useAppState();

  const handleAddUnit = (newUnit: Unit) => {
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    syncCustomerUnits(updatedUnits, customers, setCustomers, viewingTenantDetails, setViewingTenantDetails);
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
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    syncCustomerUnits(units, updatedCustomers, setCustomers, viewingTenantDetails, setViewingTenantDetails);
  };

  const handleUnitUpdate = (updatedUnit: Unit) => {
    const updatedUnits = units.map(unit => 
      unit.id === updatedUnit.id ? updatedUnit : unit
    );
    setUnits(updatedUnits);
    setViewingUnitDetails(updatedUnit);
    
    // Sync customer units after unit update
    syncCustomerUnits(updatedUnits, customers, setCustomers, viewingTenantDetails, setViewingTenantDetails);
  };

  const handleQuickAddUnit = () => {
    setShowAddUnitDialog(true);
  };

  const handleFloorPlanClick = () => {
    setShowFloorPlan(true);
    setActiveView("floor-plan");
  };

  const handleBackFromFloorPlan = () => {
    setShowFloorPlan(false);
    setActiveView("dashboard");
  };

  // Enhanced navigation handler that clears any detail views
  const handleNavigationChange = (view: string) => {
    setActiveView(view);
    setViewingUnitDetails(null);
    setViewingTenantDetails(null);
    setSelectedUnitId(null);
    setSelectedCustomerId(null);
    setShowFloorPlan(false);
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
            onFloorPlanClick={handleFloorPlanClick}
          />
          <main className="flex-1 overflow-y-auto">
            <ContentRenderer
              activeView={activeView}
              searchQuery={searchQuery}
              selectedUnitId={selectedUnitId}
              selectedCustomerId={selectedCustomerId}
              viewingUnitDetails={viewingUnitDetails}
              viewingTenantDetails={viewingTenantDetails}
              showFloorPlan={showFloorPlan}
              units={units}
              customers={customers}
              onUnitSelect={setViewingUnitDetails}
              onUnitUpdate={handleUnitUpdate}
              onUnitAdd={handleAddUnit}
              onCustomerAdd={handleAddCustomer}
              onTenantClick={handleTenantClick}
              onClearUnitSelection={() => setSelectedUnitId(null)}
              onClearCustomerSelection={() => setSelectedCustomerId(null)}
              onBackFromUnit={() => setViewingUnitDetails(null)}
              onBackFromTenant={() => setViewingTenantDetails(null)}
              onBackFromFloorPlan={handleBackFromFloorPlan}
              onQuickAddUnit={handleQuickAddUnit}
            />
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
