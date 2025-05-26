
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Thermometer, Lock } from "lucide-react";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
}

interface UnitCardProps {
  unit: Unit;
  isSelected: boolean;
  onTenantClick: (tenantId: string) => void;
  onViewDetails: (unit: Unit) => void;
}

export const UnitCard = ({ unit, isSelected, onTenantClick, onViewDetails }: UnitCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTenantClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unit.tenantId) {
      onTenantClick(unit.tenantId);
    }
  };

  const handleCardClick = () => {
    onViewDetails(unit);
  };

  return (
    <Card 
      className={`hover:shadow-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } flex flex-col h-full`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {unit.id}
          </CardTitle>
          <Badge className={getStatusColor(unit.status)}>
            {unit.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Package className="h-4 w-4" />
            <span>{unit.size}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{unit.type}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Rate:</span>
            <span className="font-semibold text-gray-900">${unit.rate}</span>
          </div>
          
          {unit.tenant && unit.tenantId && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tenant:</span>
              <button
                onClick={handleTenantClick}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {unit.tenant}
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {unit.climate && (
              <Badge variant="outline" className="text-xs">
                <Thermometer className="h-3 w-3 mr-1" />
                Climate
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
