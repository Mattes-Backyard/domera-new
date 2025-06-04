
import { useState } from "react";
import { UnitHeader } from "./UnitHeader";
import { UnitDetailsCard } from "./UnitDetailsCard";
import { UnitQuickInfo } from "./UnitQuickInfo";
import { UnitServicesCard } from "./UnitServicesCard";
import { UnitAmenitiesCard } from "./UnitAmenitiesCard";
import { UnitHistoryTabs } from "./UnitHistoryTabs";
import { EditUnitDialog } from "./EditUnitDialog";
import { AssignTenantDialog } from "./AssignTenantDialog";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  lease_end_date?: string;
  security_deposit?: number;
  balance?: number;
  notes?: string;
  facility_id: string;
}

interface Facility {
  id: string;
  name: string;
}

interface UnitDetailsPageProps {
  unit: Unit;
  onBack: () => void;
  onUnitUpdate?: (updatedUnit: Unit) => void;
  customers?: Customer[];
  facilities?: Facility[];
}

export const UnitDetailsPage = ({ unit, onBack, onUnitUpdate, customers = [], facilities = [] }: UnitDetailsPageProps) => {
  const isMobile = useIsMobile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignCustomerDialogOpen, setIsAssignCustomerDialogOpen] = useState(false);

  const handleUnitUpdate = (updatedUnit: Unit) => {
    console.log("Unit updated:", updatedUnit);
    onUnitUpdate?.(updatedUnit);
  };

  const handleCustomerAssignment = (customerId: string, customerName: string) => {
    const updatedUnit = {
      ...unit,
      tenant: customerName,
      tenantId: customerId,
      status: "occupied" as const
    };
    console.log("Customer assigned to unit:", updatedUnit);
    onUnitUpdate?.(updatedUnit);
  };

  return (
    <div className="p-4 sm:p-6">
      <UnitHeader 
        unit={unit} 
        onBack={onBack} 
        onEdit={() => setIsEditDialogOpen(true)}
        onAssignTenant={() => setIsAssignCustomerDialogOpen(true)}
      />

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-3 gap-6'}`}>
        <div className={isMobile ? '' : 'lg:col-span-2'}>
          <UnitDetailsCard unit={unit} />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <UnitQuickInfo unit={unit} />
          <UnitServicesCard />
          <UnitAmenitiesCard />
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <UnitHistoryTabs />
      </div>

      <EditUnitDialog
        unit={unit}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUnitUpdate}
        facilities={facilities}
      />

      <AssignTenantDialog
        unit={unit}
        isOpen={isAssignCustomerDialogOpen}
        onClose={() => setIsAssignCustomerDialogOpen(false)}
        onAssign={handleCustomerAssignment}
      />
    </div>
  );
};
