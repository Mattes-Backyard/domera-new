
import { useState } from "react";
import { CustomerCard } from "./CustomerCard";
import { CustomerTableView } from "./CustomerTableView";
import { CustomerGridHeader } from "./CustomerGridHeader";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { DatabaseCustomer } from "@/types/customer";
import { useToast } from "@/hooks/use-toast";

interface CustomerListProps {
  searchQuery: string;
  selectedCustomerId: string | null;
  onClearSelection: () => void;
  customers: DatabaseCustomer[];
  onCustomerAdd: (customer: DatabaseCustomer) => void;
  onCustomerClick: (customerId: string) => void;
  customerUnits?: Record<string, string[]>;
  facilities?: any[];
}

export const CustomerList = ({
  searchQuery: externalSearchQuery,
  selectedCustomerId,
  onClearSelection,
  customers,
  onCustomerAdd,
  onCustomerClick,
  customerUnits = {},
  facilities = [],
}: CustomerListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table'); // Default to table for facility managers
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [joinDateFilter, setJoinDateFilter] = useState("all");
  
  const { toast } = useToast();

  const effectiveSearchQuery = externalSearchQuery || localSearchQuery;
  
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim().toLowerCase();
    const searchLower = effectiveSearchQuery.toLowerCase();
    const matchesSearch = !effectiveSearchQuery || 
      customerName.includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(effectiveSearchQuery) ||
      customer.address?.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;

    // Facility filter
    const matchesFacility = facilityFilter === "all" || customer.facility_id === facilityFilter;

    // Balance filter
    let matchesBalance = true;
    if (balanceFilter === "current") {
      matchesBalance = !customer.balance || customer.balance <= 0;
    } else if (balanceFilter === "overdue") {
      matchesBalance = customer.balance && customer.balance > 0 && customer.balance <= 100;
    } else if (balanceFilter === "critical") {
      matchesBalance = customer.balance && customer.balance > 100;
    }

    // Join date filter
    let matchesJoinDate = true;
    if (joinDateFilter !== "all" && customer.join_date) {
      const joinDate = new Date(customer.join_date);
      const now = new Date();
      
      switch (joinDateFilter) {
        case "this_month":
          matchesJoinDate = joinDate.getMonth() === now.getMonth() && 
                           joinDate.getFullYear() === now.getFullYear();
          break;
        case "last_month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          matchesJoinDate = joinDate.getMonth() === lastMonth.getMonth() && 
                           joinDate.getFullYear() === lastMonth.getFullYear();
          break;
        case "this_quarter":
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3);
          matchesJoinDate = joinDate >= quarterStart;
          break;
        case "this_year":
          matchesJoinDate = joinDate.getFullYear() === now.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesFacility && matchesBalance && matchesJoinDate;
  });

  const handleViewDetails = (customer: DatabaseCustomer) => {
    onCustomerClick(customer.id);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    setStatusFilter("all");
    setFacilityFilter("all");
    setBalanceFilter("all");
    setJoinDateFilter("all");
    if (selectedCustomerId) {
      onClearSelection();
    }
  };

  const handleBulkAction = (action: string, customerIds?: string[]) => {
    switch (action) {
      case 'export':
        toast({
          title: "Exporting customers...",
          description: "Your customer data export will be ready shortly.",
        });
        break;
      case 'send_reminders':
        toast({
          title: "Sending reminders...",
          description: "Payment reminders are being sent to customers with outstanding balances.",
        });
        break;
      case 'send_reminder':
        if (customerIds) {
          toast({
            title: "Sending reminders...",
            description: `Payment reminders sent to ${customerIds.length} customer${customerIds.length !== 1 ? 's' : ''}.`,
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 p-6 h-full overflow-auto">
      <CustomerGridHeader
        customers={customers}
        onAddCustomer={() => setIsAddDialogOpen(true)}
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        facilityFilter={facilityFilter}
        onFacilityFilterChange={setFacilityFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        facilities={facilities}
        onBulkAction={handleBulkAction}
      />

      {effectiveSearchQuery && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredCustomers.length} customer(s) found for "{effectiveSearchQuery}"
          </p>
        </div>
      )}

      {viewMode === 'table' ? (
        <CustomerTableView
          customers={filteredCustomers}
          onViewDetails={handleViewDetails}
          selectedCustomerId={selectedCustomerId}
          onBulkAction={handleBulkAction}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              isSelected={selectedCustomerId === customer.id}
              onViewDetails={handleViewDetails}
              units={customerUnits[customer.id] || []}
            />
          ))}
        </div>
      )}

      {filteredCustomers.length === 0 && effectiveSearchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found matching "{effectiveSearchQuery}"</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms or filters</p>
        </div>
      )}

      {filteredCustomers.length === 0 && !effectiveSearchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers match the current filters.</p>
          <p className="text-gray-400 text-sm mt-1">Try clearing some filters or add your first customer.</p>
        </div>
      )}

      <AddCustomerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onCustomerAdd={onCustomerAdd}
      />
    </div>
  );
};
