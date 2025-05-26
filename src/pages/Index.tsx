
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
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleSearchResultClick = (type: 'unit' | 'customer', id: string) => {
    if (type === 'unit') {
      setSelectedUnitId(id);
      setActiveView("units");
    } else if (type === 'customer') {
      setSelectedCustomerId(id);
      setActiveView("customers");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "units":
        return <UnitGrid searchQuery={searchQuery} selectedUnitId={selectedUnitId} onClearSelection={() => setSelectedUnitId(null)} />;
      case "customers":
        return <CustomerList selectedCustomerId={selectedCustomerId} onClearSelection={() => setSelectedCustomerId(null)} />;
      case "operations":
        return <OperationsView />;
      case "dashboard":
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            <div className="lg:col-span-8 space-y-6">
              <OverviewStats />
              <OccupancyChart />
              <RecentActivity />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <QuickActions />
              <AIInsights />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery}
            onSearchResultClick={handleSearchResultClick}
          />
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
