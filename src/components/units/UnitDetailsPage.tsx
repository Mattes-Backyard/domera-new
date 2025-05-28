
import { useState } from "react";
import { UnitHeader } from "./UnitHeader";
import { UnitDetailsCard } from "./UnitDetailsCard";
import { UnitQuickInfo } from "./UnitQuickInfo";
import { UnitServicesCard } from "./UnitServicesCard";
import { UnitAmenitiesCard } from "./UnitAmenitiesCard";
import { UnitHistoryTabs } from "./UnitHistoryTabs";
import { EditUnitDialog } from "./EditUnitDialog";
import { AssignTenantDialog } from "./AssignTenantDialog";

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

interface UnitDetailsPageProps {
  unit: Unit;
  onBack: () => void;
  onUnitUpdate?: (updatedUnit: Unit) => void;
}

export const UnitDetailsPage = ({ unit, onBack, onUnitUpdate }: UnitDetailsPageProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignTenantDialogOpen, setIsAssignTenantDialogOpen] = useState(false);

  const handleUnitUpdate = (updatedUnit: Unit) => {
    console.log("Unit updated:", updatedUnit);
    onUnitUpdate?.(updatedUnit);
  };

  const handleTenantAssignment = (tenantId: string, tenantName: string) => {
    const updatedUnit = {
      ...unit,
      tenant: tenantName,
      tenantId: tenantId,
      status: "occupied" as const
    };
    console.log("Tenant assigned to unit:", updatedUnit);
    onUnitUpdate?.(updatedUnit);
  };

  return (
    <div className="p-6">
      <UnitHeader 
        unit={unit} 
        onBack={onBack} 
        onEdit={() => setIsEditDialogOpen(true)}
        onAssignTenant={() => setIsAssignTenantDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UnitDetailsCard unit={unit} />
        </div>

        <div className="space-y-6">
          <UnitQuickInfo unit={unit} />
          <UnitServicesCard />
          <UnitAmenitiesCard />
        </div>
      </div>

      <div className="mt-8">
        <UnitHistoryTabs />
      </div>

      <EditUnitDialog
        unit={unit}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUnitUpdate}
      />

      <AssignTenantDialog
        unit={unit}
        isOpen={isAssignTenantDialogOpen}
        onClose={() => setIsAssignTenantDialogOpen(false)}
        onAssign={handleTenantAssignment}
      />
    </div>
  );
};
