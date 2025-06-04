
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Package } from "lucide-react";
import { DatabaseCustomer } from "@/types/customer";

interface CustomerCardProps {
  customer: DatabaseCustomer;
  isSelected: boolean;
  onViewDetails: (customer: DatabaseCustomer) => void;
  units?: string[];
}

export const CustomerCard = ({ customer, isSelected, onViewDetails, units = [] }: CustomerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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

  // Use actual database fields instead of fallback logic
  const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer';
  const customerAddress = `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zip_code || ''}`;

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {customerName}
          </CardTitle>
          <Badge className={getStatusColor(customer.status || 'active')}>
            {customer.status || 'active'}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>{customer.email || 'No email'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{customer.phone || 'No phone'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{units.length} unit(s)</span>
            </div>
            <span className="text-sm text-gray-600">
              Units: {units.join(", ") || "None"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Balance:</span>
            <span className={`font-semibold ${getBalanceColor(customer.balance || 0)}`}>
              ${Math.abs(customer.balance || 0)}
              {(customer.balance || 0) !== 0 && (
                <span className="text-xs ml-1">
                  {(customer.balance || 0) > 0 ? "owed" : "credit"}
                </span>
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Join Date:</span>
            <span className="text-sm font-medium">{customer.join_date || customer.move_in_date || "N/A"}</span>
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
