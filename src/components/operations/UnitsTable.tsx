
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId?: string | null;
  rate: number;
  climate: boolean;
}

interface UnitsTableProps {
  units: Unit[];
  selectedUnits: string[];
  onSelectUnit: (unitId: string) => void;
  onSelectAll: () => void;
  onTenantClick?: (tenantId: string) => void;
}

export const UnitsTable = ({ units, selectedUnits, onSelectUnit, onSelectAll, onTenantClick }: UnitsTableProps) => {
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

  const handleTenantClick = (tenantId: string) => {
    if (onTenantClick) {
      onTenantClick(tenantId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Units ({units.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedUnits.length === units.length && units.length > 0}
              onCheckedChange={onSelectAll}
            />
            <Label>Select All</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {units.map((unit) => (
            <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedUnits.includes(unit.id)}
                  onCheckedChange={() => onSelectUnit(unit.id)}
                />
                <div className="flex items-center space-x-4">
                  <div className="font-semibold">{unit.id}</div>
                  <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                  <div className="text-sm text-gray-600">{unit.size} • {unit.type}</div>
                  {unit.tenant && unit.tenantId && (
                    <button
                      onClick={() => handleTenantClick(unit.tenantId!)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {unit.tenant}
                    </button>
                  )}
                  {unit.tenant && !unit.tenantId && (
                    <div className="text-sm text-blue-600">{unit.tenant}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="font-semibold">${unit.rate}/month</div>
                {unit.climate && (
                  <Badge variant="outline" className="text-xs">Climate</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
