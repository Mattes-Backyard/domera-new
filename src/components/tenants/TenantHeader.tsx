
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";

interface Tenant {
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

interface TenantHeaderProps {
  tenant: Tenant;
  onBack: () => void;
}

export const TenantHeader = ({ tenant, onBack }: TenantHeaderProps) => {
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

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            <Badge className={getStatusColor(tenant.status)}>
              {tenant.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Tenant ID: {tenant.id} • {tenant.units.length} unit(s)
          </p>
        </div>
      </div>
      <Button>
        <Edit className="h-4 w-4 mr-2" />
        Edit Tenant
      </Button>
    </div>
  );
};
