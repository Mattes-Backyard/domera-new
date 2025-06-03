import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ContentRenderer } from "@/components/dashboard/ContentRenderer";
import { AddUnitDialog } from "@/components/units/AddUnitDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useState } from "react";
import type { Unit, Customer } from "@/hooks/useAppState";

const Index = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const { units, customers, loading: dataLoading, addUnit, updateUnit, addCustomer } = useSupabaseData();
  
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [viewingTenantDetails, setViewingTenantDetails] = useState<Customer | null>(null);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false);
  const [selectedSites, setSelectedSites] = useState(["helsingborg"]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm />;
  }

  // Filter units based on selected sites
  const filteredUnits = units.filter(unit => selectedSites.includes(unit.site));

  const handleAddUnit = (newUnit: Unit) => {
    console.log("Adding new unit:", newUnit);
    addUnit(newUnit);
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
    addCustomer(newCustomer);
  };

  const handleUnitUpdate = (updatedUnit: Unit) => {
    console.log("Handling unit update:", updatedUnit);
    updateUnit(updatedUnit);
    setViewingUnitDetails(updatedUnit);
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

  const handleAdminClick = () => {
    setActiveView("admin");
    setViewingUnitDetails(null);
    setViewingTenantDetails(null);
    setSelectedUnitId(null);
    setSelectedCustomerId(null);
    setShowFloorPlan(false);
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
            onAdminClick={profile?.role === 'admin' ? handleAdminClick : undefined}
          />
          <main className="flex-1 overflow-y-auto">
            {dataLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Loading data...</p>
                </div>
              </div>
            ) : (
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
                selectedSites={selectedSites}
              />
            )}
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
