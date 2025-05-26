import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Calendar, X } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { useEffect } from "react";

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

interface CustomerListProps {
  selectedCustomerId?: string | null;
  onClearSelection?: () => void;
  customers?: Customer[];
  onAddCustomer?: (customer: Customer) => void;
  onViewDetails?: (customer: Customer) => void;
  triggerAddDialog?: boolean;
  onAddDialogClose?: () => void;
}

export const CustomerList = ({ 
  selectedCustomerId, 
  onClearSelection, 
  customers = [], 
  onAddCustomer, 
  onViewDetails,
  triggerAddDialog = false,
  onAddDialogClose
}: CustomerListProps) => {
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

  const filteredCustomers = selectedCustomerId 
    ? customers.filter(customer => customer.id === selectedCustomerId)
    : customers;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">
            Manage customer profiles and rental history
            {selectedCustomerId && (
              <span className="ml-2 text-sm text-blue-600">
                • Showing customer {filteredCustomers[0]?.name}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCustomerId && (
            <Button variant="outline" onClick={onClearSelection} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className={`hover:shadow-lg transition-shadow duration-200 ${selectedCustomerId === customer.id ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {customer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {customer.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">Customer ID: {customer.id}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {customer.joinDate}</span>
                </div>
                
                {customer.units.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Units: {customer.units.join(", ")}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Account Balance:</span>
                  <span className={`font-semibold ${getBalanceColor(customer.balance)}`}>
                    ${Math.abs(customer.balance)} {customer.balance < 0 ? "overdue" : customer.balance > 0 ? "credit" : ""}
                  </span>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onViewDetails?.(customer)}
                  >
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
