
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Unit } from "@/hooks/useUnits";

interface UnitDetailsCardProps {
  unit: Unit;
}

export const UnitDetailsCard = ({ unit }: UnitDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Storage Category</label>
              <p className="text-gray-900">{unit.type}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Storage Number</label>
              <p className="text-gray-900">{unit.id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-gray-900">Building A</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Building</label>
              <p className="text-gray-900">Main Storage</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Type</label>
              <p className="text-gray-900">{unit.size}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Size</label>
              <p className="text-gray-900">{unit.size}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Conditions</label>
              <p className="text-gray-900">{unit.climate_controlled ? "Climate Controlled" : "Standard"}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Security Deposit</label>
              <p className="text-gray-900">$0.00</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-600">Online unit description</label>
            <p className="text-gray-900 mt-1">
              Climate controlled storage unit with secure access. Perfect for temperature-sensitive items.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
