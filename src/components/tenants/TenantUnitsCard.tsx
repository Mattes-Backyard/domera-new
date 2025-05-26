
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface TenantUnit {
  unitId: string;
  unitNumber: string;
  status: "good" | "overdue" | "pending";
  monthlyRate: number;
  leaseStart: string;
  leaseEnd?: string;
  balance: number;
}

interface TenantUnitsCardProps {
  units: TenantUnit[];
  selectedUnit: string;
  onUnitSelect: (unitId: string) => void;
}

export const TenantUnitsCard = ({ units, selectedUnit, onUnitSelect }: TenantUnitsCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "Good Standing";
      case "overdue":
        return "Overdue";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Units</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {units.map((unit) => (
          <div
            key={unit.unitId}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedUnit === unit.unitId 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUnitSelect(unit.unitId)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{unit.unitNumber}</span>
              </div>
              <Badge className={getStatusColor(unit.status)}>
                {getStatusText(unit.status)}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <p>Rate: ${unit.monthlyRate}/month</p>
              <p>Balance: ${unit.balance}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
