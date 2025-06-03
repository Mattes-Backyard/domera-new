
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ContentRenderer } from "@/components/dashboard/ContentRenderer";
import { AddUnitDialog } from "@/components/units/AddUnitDialog";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppState } from "@/hooks/useAppState";
import { updateUnitWithSync } from "@/utils/customerSync";
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
    selectedSites,
    setSelectedSites,
    addUnit,
  } = useAppState();

  // Add state for customer dialog
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);

  // Filter units based on selected sites
  const filteredUnits = units.filter(unit => selectedSites.includes(unit.site));

  const handleAddUnit = (newUnit: Unit) => {
    console.log("Adding new unit:", newUnit);
    addUnit(newUnit);
    // Sync happens automatically in addUnit via useAppState
  };

  const handleTenantClick = (tenantId: string) => {
    const customer = customers.find(c => c.id === tenantId);
    if (customer) {
      console.log("Viewing tenant details:", customer.id);
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
    console.log("Adding new customer:", newCustomer);
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
  };

  const handleUnitUpdate = (updatedUnit: Unit) => {
    console.log("Handling unit update with sync:", updatedUnit);
    updateUnitWithSync(
      updatedUnit,
      units,
      customers,
      setUnits,
      setCustomers,
      viewingTenantDetails,
      setViewingTenantDetails
    );
    setViewingUnitDetails(updatedUnit);
  };

  const handleQuickAddUnit = () => {
    setShowAddUnitDialog(true);
  };

  const handleQuickAddCustomer = () => {
    setShowAddCustomerDialog(true);
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
            selectedSites={selectedSites}
            onSitesChange={setSelectedSites}
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
              units={filteredUnits}
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
              onQuickAddCustomer={handleQuickAddCustomer}
              selectedSites={selectedSites}
            />
          </main>
        </div>
        
        {/* Global Add Unit Dialog */}
        <AddUnitDialog
          isOpen={showAddUnitDialog}
          onClose={() => setShowAddUnitDialog(false)}
          onSave={handleAddUnit}
        />

        {/* Global Add Customer Dialog */}
        <AddCustomerDialog
          isOpen={showAddCustomerDialog}
          onClose={() => setShowAddCustomerDialog(false)}
          onSave={handleAddCustomer}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
