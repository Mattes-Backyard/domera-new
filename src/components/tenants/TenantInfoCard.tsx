
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, CreditCard, Calendar } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ssn: string;
  status: string;
  joinDate: string;
  units: any[];
}

interface CustomerInfoCardProps {
  tenant: Customer;
}

export const TenantInfoCard = ({ tenant: customer }: CustomerInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-12">
          <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 w-20">Name:</span>
              <span className="font-medium">{customer.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.phone}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{customer.address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">SSN</p>
              <p className="font-medium">{customer.ssn}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-medium">{customer.joinDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Tax Exemptions</p>
              <div className="flex space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">Rent</Badge>
                <Badge variant="outline" className="text-xs">Insurance</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
