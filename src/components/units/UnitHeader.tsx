
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit, ArrowLeft, UserPlus, MoreVertical } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface UnitHeaderProps {
  unit: Unit;
  onBack: () => void;
  onEdit: () => void;
  onAssignTenant?: () => void;
}

export const UnitHeader = ({ unit, onBack, onEdit, onAssignTenant }: UnitHeaderProps) => {
  const isMobile = useIsMobile();
  
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

  return (
    <div className="mb-4 sm:mb-6">
      <Button 
        variant="outline" 
        onClick={onBack} 
        className="flex items-center gap-2 mb-3 sm:mb-4"
        size={isMobile ? "sm" : "default"}
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`${isMobile ? 'w-12 h-12' : 'w-20 h-20'} bg-gray-100 rounded-lg flex items-center justify-center`}>
            <Package className={`${isMobile ? 'h-6 w-6' : 'h-10 w-10'} text-gray-400`} />
          </div>
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>{unit.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(unit.status)}>
                {unit.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onAssignTenant && unit.status !== "occupied" && (
                  <DropdownMenuItem onClick={onAssignTenant}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Tenant
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Unit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {onAssignTenant && unit.status !== "occupied" && (
                <Button variant="outline" onClick={onAssignTenant} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Assign Tenant
                </Button>
              )}
              <Button onClick={onEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Unit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
