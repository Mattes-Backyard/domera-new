
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
import { useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Use real-time data instead of regular data
  const { 
    units, 
    customers, 
    facilities, 
    loading, 
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

  // Enable real-time notifications
  useRealtimeNotifications();

  if (!user) {
    return <AuthForm />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        <div className="flex h-screen bg-gray-50">
          <DashboardSidebar 
            activeView={activeView} 
            setActiveView={setActiveView}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
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
              <div className="px-6 py-2 border-b bg-white">
                <MultiSiteSelector 
                  selectedSites={selectedSites}
                  onSitesChange={setSelectedSites}
                />
              </div>
            )}
            
            <main className="flex-1 overflow-hidden">
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
            </main>
          </div>
        </div>
      </TaskProvider>
    </NotificationProvider>
  );
};

export default Index;
