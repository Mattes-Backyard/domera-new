
import { useState } from "react";
import { CustomerCard } from "./CustomerCard";
import { CustomerTableView } from "./CustomerTableView";
import { CustomerGridHeader } from "./CustomerGridHeader";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { DatabaseCustomer } from "@/types/customer";

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const effectiveSearchQuery = externalSearchQuery || localSearchQuery;
  
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim().toLowerCase();
    const searchLower = effectiveSearchQuery.toLowerCase();
    const matchesSearch = !effectiveSearchQuery || 
      customerName.includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(effectiveSearchQuery);

    // Status filter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;

    // Facility filter
    const matchesFacility = facilityFilter === "all" || customer.facility_id === facilityFilter;

    return matchesSearch && matchesStatus && matchesFacility;
  });

  const handleViewDetails = (customer: DatabaseCustomer) => {
    onCustomerClick(customer.id);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    setStatusFilter("all");
    setFacilityFilter("all");
    if (selectedCustomerId) {
      onClearSelection();
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
        </div>
      )}

      {filteredCustomers.length === 0 && !effectiveSearchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers yet. Add your first customer to get started.</p>
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
