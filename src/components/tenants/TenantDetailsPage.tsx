
import { useState } from "react";
import { TenantHeader } from "./TenantHeader";
import { TenantInfoCard } from "./TenantInfoCard";
import { TenantUnitsCard } from "./TenantUnitsCard";
import { TenantLedgerTabs } from "./TenantLedgerTabs";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ssn: string;
  status: string;
  joinDate: string;
  units: TenantUnit[];
}

interface TenantUnit {
  unitId: string;
  unitNumber: string;
  status: "good" | "overdue" | "pending";
  monthlyRate: number;
  leaseStart: string;
  leaseEnd?: string;
  balance: number;
}

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
