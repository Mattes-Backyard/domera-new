
import { AuthForm } from "@/components/auth/AuthForm";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ContentRenderer } from "@/components/dashboard/ContentRenderer";
import { MultiSiteSelector } from "@/components/dashboard/MultiSiteSelector";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeSupabaseData } from "@/hooks/useRealtimeSupabaseData";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useAppState } from "@/hooks/useAppState";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Use real-time data instead of regular data
  const { 
    units, 
    customers, 
    facilities, 
    loading: dataLoading, 
    addUnit, 
    updateUnit, 
    addCustomer 
  } = useRealtimeSupabaseData();

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
    selectedSites,
    setSelectedSites,
  } = useAppState();

  // Enable real-time notifications only when user is authenticated
  useRealtimeNotifications();

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm />;
  }

  // Show data loading screen for authenticated users
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  const handleUnitSelect = (unit: any) => {
    setViewingUnitDetails(unit);
  };

  const handleUnitUpdate = (updatedUnit: any) => {
    updateUnit(updatedUnit);
  };

  const handleUnitAdd = (newUnit: any) => {
    addUnit(newUnit);
  };

  const handleCustomerAdd = (newCustomer: any) => {
    addCustomer(newCustomer);
  };

  const handleTenantClick = (tenantId: string) => {
    const customer = customers.find(c => c.id === tenantId);
    if (customer) {
      setViewingTenantDetails(customer);
    }
  };

  const handleClearUnitSelection = () => {
    setSelectedUnitId(null);
  };

  const handleClearCustomerSelection = () => {
    setSelectedCustomerId(null);
  };

  const handleBackFromUnit = () => {
    setViewingUnitDetails(null);
  };

  const handleBackFromTenant = () => {
    setViewingTenantDetails(null);
  };

  const handleBackFromFloorPlan = () => {
    setShowFloorPlan(false);
  };

  const handleQuickAddUnit = () => {
    setActiveView("units");
  };

  const handleSearchResultClick = (type: 'unit' | 'customer', id: string) => {
    if (type === 'unit') {
      setSelectedUnitId(id);
      setActiveView('units');
    } else if (type === 'customer') {
      setSelectedCustomerId(id);
      setActiveView('customers');
    }
  };

  return (
    <NotificationProvider>
      <TaskProvider>
        <SidebarProvider>
          <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
            <DashboardSidebar 
              activeView={activeView} 
              setActiveView={setActiveView}
            />
            
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <DashboardHeader 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchResultClick={handleSearchResultClick}
                units={units}
                customers={customers}
                onFloorPlanClick={() => setShowFloorPlan(true)}
                selectedSites={selectedSites}
                onSitesChange={setSelectedSites}
              />
              
              {(activeView === "dashboard" || activeView === "operations") && (
                <div className="px-6 py-2 border-b bg-white flex-shrink-0">
                  <MultiSiteSelector 
                    selectedSites={selectedSites}
                    onSitesChange={setSelectedSites}
                  />
                </div>
              )}
              
              <div className="flex-1 overflow-hidden">
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
                  onUnitSelect={handleUnitSelect}
                  onUnitUpdate={handleUnitUpdate}
                  onUnitAdd={handleUnitAdd}
                  onCustomerAdd={handleCustomerAdd}
                  onTenantClick={handleTenantClick}
                  onClearUnitSelection={handleClearUnitSelection}
                  onClearCustomerSelection={handleClearCustomerSelection}
                  onBackFromUnit={handleBackFromUnit}
                  onBackFromTenant={handleBackFromTenant}
                  onBackFromFloorPlan={handleBackFromFloorPlan}
                  onQuickAddUnit={handleQuickAddUnit}
                  selectedSites={selectedSites}
                />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </TaskProvider>
    </NotificationProvider>
  );
};

export default Index;
