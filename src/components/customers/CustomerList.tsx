
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, MapPin, Calendar, X, Search, Filter } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { useState } from "react";

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

// DatabaseCustomer type from Supabase
interface DatabaseCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  lease_end_date?: string;
  security_deposit?: number;
  balance?: number;
  notes?: string;
  facility_id: string;
}

interface CustomerListProps {
  selectedCustomerId?: string | null;
  onClearSelection?: () => void;
  customers?: Customer[];
  onCustomerAdd?: (customer: DatabaseCustomer) => void;
  onTenantClick?: (tenantId: string) => void;
  triggerAddDialog?: boolean;
  onAddDialogClose?: () => void;
}

export const CustomerList = ({ 
  selectedCustomerId, 
  onClearSelection, 
  customers = [], 
  onCustomerAdd, 
  onTenantClick,
  triggerAddDialog = false,
  onAddDialogClose
}: CustomerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "former":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         customer.units.some(unit => unit.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    const matchesBalance = balanceFilter === "all" || 
                          (balanceFilter === "positive" && customer.balance > 0) ||
                          (balanceFilter === "negative" && customer.balance < 0) ||
                          (balanceFilter === "zero" && customer.balance === 0);
    
    return matchesSearch && matchesStatus && matchesBalance;
  });

  const handleCustomerClick = (customer: Customer) => {
    console.log("Customer clicked:", customer.id);
    onTenantClick?.(customer.id);
  };

  // Wrapper function to handle the type conversion
  const handleAddCustomer = (dbCustomer: DatabaseCustomer) => {
    console.log("Adding customer:", dbCustomer);
    onCustomerAdd?.(dbCustomer);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">
            Browse and manage customer profiles ({filteredCustomers.length} of {customers.length} customers)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCustomerId && (
            <Button variant="outline" onClick={onClearSelection} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
          )}
          <AddCustomerDialog onSave={handleAddCustomer} />
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="former">Former</SelectItem>
            </SelectContent>
          </Select>

          <Select value={balanceFilter} onValueChange={setBalanceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All balances" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All balances</SelectItem>
              <SelectItem value="positive">Credit balance</SelectItem>
              <SelectItem value="negative">Overdue</SelectItem>
              <SelectItem value="zero">Zero balance</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setBalanceFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow 
                key={customer.id} 
                className={`cursor-pointer hover:bg-gray-50 ${selectedCustomerId === customer.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleCustomerClick(customer)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">ID: {customer.id}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-3 w-3 mr-1" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-1" />
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                    {customer.units.length > 0 ? customer.units.join(", ") : "None"}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className={`font-semibold ${getBalanceColor(customer.balance)}`}>
                    ${Math.abs(customer.balance)} {customer.balance < 0 ? "overdue" : customer.balance > 0 ? "credit" : ""}
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {customer.joinDate}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomerClick(customer);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No customers found matching your criteria.
          </div>
        )}
      </Card>
    </div>
  );
};
