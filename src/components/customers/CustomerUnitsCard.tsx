
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerUnit } from "@/types/customer";

interface CustomerUnitsCardProps {
  units: CustomerUnit[];
  selectedUnit: string;
  onUnitSelect: (unitId: string) => void;
}

export const CustomerUnitsCard = ({ units, selectedUnit, onUnitSelect }: CustomerUnitsCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Units ({units.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {units.map((unit) => (
          <div
            key={unit.unitId}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedUnit === unit.unitId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUnitSelect(unit.unitId)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{unit.unitNumber}</p>
                <p className="text-sm text-gray-600">${unit.monthlyRate}/month</p>
              </div>
              <Badge className={getStatusColor(unit.status)}>
                {unit.status}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Lease: {unit.leaseStart} - {unit.leaseEnd || 'Ongoing'}</p>
              {unit.balance > 0 && (
                <p className="text-red-600">Balance: ${unit.balance}</p>
              )}
            </div>
          </div>
        ))}
        {units.length === 0 && (
          <p className="text-gray-500 text-center py-4">No units assigned</p>
        )}
      </CardContent>
    </Card>
  );
};
