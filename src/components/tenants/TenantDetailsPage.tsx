
import { useState } from "react";
import { TenantHeader } from "./TenantHeader";
import { TenantInfoCard } from "./TenantInfoCard";
import { TenantUnitsCard } from "./TenantUnitsCard";
import { TenantLedgerTabs } from "./TenantLedgerTabs";
import { DatabaseCustomer } from "@/types/customer";

interface TenantDetailsPageProps {
  tenant: DatabaseCustomer;
  onBack: () => void;
}

export const TenantDetailsPage = ({ tenant, onBack }: TenantDetailsPageProps) => {
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  // Transform DatabaseCustomer to match the expected Tenant interface
  const transformedTenant = {
    id: tenant.id,
    name: tenant.emergency_contact_name || 'Unknown Customer',
    email: `customer${tenant.id.slice(0, 8)}@storage.com`,
    phone: tenant.emergency_contact_phone || '',
    address: '',
    ssn: '',
    status: 'active',
    joinDate: tenant.move_in_date || new Date().toISOString().split('T')[0],
    units: []
  };

  return (
    <div className="p-6">
      <TenantHeader tenant={transformedTenant} onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TenantInfoCard tenant={tenant} />
        </div>

        <div className="space-y-6">
          <TenantUnitsCard 
            units={[]} 
            selectedUnit={selectedUnit}
            onUnitSelect={setSelectedUnit}
          />
        </div>
      </div>

      <div className="mt-8">
        <TenantLedgerTabs 
          tenantId={tenant.id}
          units={[]}
          selectedUnit={selectedUnit}
        />
      </div>
    </div>
  );
};
