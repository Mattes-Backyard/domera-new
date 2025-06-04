
import { useState } from "react";
import { TenantHeader } from "./TenantHeader";
import { TenantInfoCard } from "./TenantInfoCard";
import { TenantUnitsCard } from "./TenantUnitsCard";
import { TenantLedgerTabs } from "./TenantLedgerTabs";
import { Tenant } from "@/types/customer";

interface TenantDetailsPageProps {
  tenant: Tenant;
  onBack: () => void;
}

export const TenantDetailsPage = ({ tenant, onBack }: TenantDetailsPageProps) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(tenant.units[0]?.unitId || "");

  return (
    <div className="p-6">
      <TenantHeader tenant={tenant} onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TenantInfoCard tenant={tenant} />
        </div>

        <div className="space-y-6">
          <TenantUnitsCard 
            units={tenant.units} 
            selectedUnit={selectedUnit}
            onUnitSelect={setSelectedUnit}
          />
        </div>
      </div>

      <div className="mt-8">
        <TenantLedgerTabs 
          tenantId={tenant.id}
          units={tenant.units}
          selectedUnit={selectedUnit}
        />
      </div>
    </div>
  );
};
