
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Package } from "lucide-react";

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

interface CustomerCardProps {
  customer: Customer;
  isSelected: boolean;
  onViewDetails: (customer: Customer) => void;
}

export const CustomerCard = ({ customer, isSelected, onViewDetails }: CustomerCardProps) => {
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
    if (balance > 0) return "text-red-600";
    if (balance < 0) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {customer.name}
          </CardTitle>
          <Badge className={getStatusColor(customer.status)}>
            {customer.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>{customer.email}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{customer.phone}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.units.length} unit(s)</span>
            </div>
            <span className="text-sm text-gray-600">
              Units: {customer.units.join(", ") || "None"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Balance:</span>
            <span className={`font-semibold ${getBalanceColor(customer.balance)}`}>
              ${Math.abs(customer.balance)}
              {customer.balance !== 0 && (
                <span className="text-xs ml-1">
                  {customer.balance > 0 ? "owed" : "credit"}
                </span>
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Join Date:</span>
            <span className="text-sm font-medium">{customer.joinDate}</span>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-3"
            onClick={() => onViewDetails(customer)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
