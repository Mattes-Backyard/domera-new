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

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  status: string;
  joinDate: string;
  balance: number;
}

const initialUnits: Unit[] = [
  { id: "A-101", size: "5x5", type: "Standard", status: "occupied", tenant: "John Smith", tenantId: "john-smith", rate: 85, climate: true },
  { id: "A-102", size: "5x5", type: "Standard", status: "available", tenant: null, tenantId: null, rate: 85, climate: true },
  { id: "A-103", size: "5x10", type: "Standard", status: "reserved", tenant: "Sarah Johnson", tenantId: "sarah-johnson", rate: 120, climate: true },
  { id: "B-201", size: "10x10", type: "Premium", status: "occupied", tenant: "Mike Wilson", tenantId: "mike-wilson", rate: 180, climate: true },
  { id: "B-202", size: "10x10", type: "Premium", status: "maintenance", tenant: null, tenantId: null, rate: 180, climate: true },
  { id: "C-301", size: "10x20", type: "Large", status: "available", tenant: null, tenantId: null, rate: 280, climate: false },
];

const initialCustomers: Customer[] = [
  {
    id: "john-smith",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    units: ["A-101"],
    status: "active",
    joinDate: "2024-01-15",
    balance: 0,
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    units: ["A-103"],
    status: "reserved",
    joinDate: "2024-05-20",
    balance: 120,
  },
  {
    id: "mike-wilson",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "(555) 345-6789",
    units: ["B-201", "C-301"],
    status: "active",
    joinDate: "2023-11-08",
    balance: -85,
  },
  {
    id: "emily-davis",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 456-7890",
    units: [],
    status: "former",
    joinDate: "2023-06-12",
    balance: 0,
  },
];

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [viewingTenantDetails, setViewingTenantDetails] = useState<Customer | null>(null);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false);

  const handleAddUnit = (newUnit: Unit) => {
    setUnits(prevUnits => [...prevUnits, newUnit]);
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
      setSelectedCustomerId(id);
      setActiveView("customers");
    }
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
  };

  const handleUnitUpdate = (updatedUnit: Unit) => {
    setUnits(prevUnits => 
      prevUnits.map(unit => 
        unit.id === updatedUnit.id ? updatedUnit : unit
      )
    );
    setViewingUnitDetails(updatedUnit);
  };

  const handleQuickAddUnit = () => {
    setShowAddUnitDialog(true);
  };

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
      // Convert customer to tenant format
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
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
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
