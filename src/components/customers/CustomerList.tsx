
import { useState } from "react";
import { CustomerCard } from "./CustomerCard";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DatabaseCustomer } from "@/types/customer";

interface CustomerListProps {
  searchQuery: string;
  selectedCustomerId: string | null;
  onClearSelection: () => void;
  customers: DatabaseCustomer[];
  onCustomerAdd: (customer: DatabaseCustomer) => void;
  onCustomerClick: (customerId: string) => void;
  customerUnits?: Record<string, string[]>;
}

export const CustomerList = ({
  searchQuery,
  selectedCustomerId,
  onClearSelection,
  customers,
  onCustomerAdd,
  onCustomerClick,
  customerUnits = {},
}: CustomerListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const effectiveSearchQuery = searchQuery || localSearchQuery;
  
  const filteredCustomers = customers.filter(customer => {
    // Use actual database fields for filtering
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim().toLowerCase();
    const searchLower = effectiveSearchQuery.toLowerCase();
    
    return customerName.includes(searchLower) ||
           customer.email?.toLowerCase().includes(searchLower) ||
           customer.phone?.includes(effectiveSearchQuery);
  });

  const handleViewDetails = (customer: DatabaseCustomer) => {
    onCustomerClick(customer.id);
  };

  return (
    <div className="space-y-6 p-6 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {!searchQuery && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {effectiveSearchQuery && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredCustomers.length} customer(s) found for "{effectiveSearchQuery}"
          </p>
          {selectedCustomerId && (
            <Button variant="outline" onClick={onClearSelection}>
              Clear Selection
            </Button>
          )}
        </div>
      )}

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
