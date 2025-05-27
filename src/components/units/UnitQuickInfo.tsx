
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Shield } from "lucide-react";
import { Unit } from "@/hooks/useUnits";

interface UnitQuickInfoProps {
  unit: Unit;
}

export const UnitQuickInfo = ({ unit }: UnitQuickInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Monthly Rate:</span>
          <span className="font-semibold text-gray-900">${unit.rate}</span>
        </div>
        
        {unit.tenant && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Tenant:</span>
            <span className="text-sm font-medium text-blue-600">{unit.tenant}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {unit.climate_controlled && (
            <Badge variant="outline" className="text-xs">
              <Thermometer className="h-3 w-3 mr-1" />
              Climate
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
