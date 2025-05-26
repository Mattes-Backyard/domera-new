import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";

const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    units: ["A-101"],
    status: "active",
    joinDate: "2024-01-15",
    balance: 0,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    units: ["A-103"],
    status: "reserved",
    joinDate: "2024-05-20",
    balance: 120,
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "(555) 345-6789",
    units: ["B-201", "C-301"],
    status: "active",
    joinDate: "2023-11-08",
    balance: -85,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 456-7890",
    units: [],
    status: "former",
    joinDate: "2023-06-12",
    balance: 0,
  },
];

export const CustomerList = () => {
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

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customer profiles and rental history</p>
        </div>
        <AddCustomerDialog />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow duration-200">
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
                  <Button variant="outline" size="sm" className="flex-1">
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
