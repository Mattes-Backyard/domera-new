
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FloorMap } from "./FloorMap";
import { UnitDetailsPage } from "../units/UnitDetailsPage";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
  site: string;
}

interface FloorPlanViewProps {
  units: Unit[];
  onBack: () => void;
  onUnitUpdate?: (updatedUnit: Unit) => void;
}

export const FloorPlanView = ({ units, onBack, onUnitUpdate }: FloorPlanViewProps) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleUnitClick = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      setSelectedUnit(unit);
    }
  };

  const handleBackFromUnit = () => {
    setSelectedUnit(null);
  };

  if (selectedUnit) {
    return (
      <UnitDetailsPage 
        unit={selectedUnit} 
        onBack={handleBackFromUnit}
        onUnitUpdate={(updatedUnit) => {
          onUnitUpdate?.(updatedUnit);
          setSelectedUnit(updatedUnit);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Floor Plan View</h1>
            <p className="text-gray-600">Birds-eye status summary - Click on units to view details and perform actions</p>
          </div>
        </div>
      </div>
      
      <FloorMap units={units} onUnitClick={handleUnitClick} />
    </div>
  );
};
