
import { useState } from "react";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { CustomerUnitsCard } from "./CustomerUnitsCard";
import { CustomerLedgerTabs } from "./CustomerLedgerTabs";
import { CustomerDetails } from "@/types/customer";

interface CustomerDetailsPageProps {
  customer: CustomerDetails;
  onBack: () => void;
}

export const CustomerDetailsPage = ({ customer, onBack }: CustomerDetailsPageProps) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(customer.units[0]?.unitId || "");

  return (
    <div className="p-6">
      <CustomerHeader customer={customer} onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomerInfoCard customer={customer} />
        </div>

        <div className="space-y-6">
          <CustomerUnitsCard 
            units={customer.units} 
            selectedUnit={selectedUnit}
            onUnitSelect={setSelectedUnit}
          />
        </div>
      </div>

      <div className="mt-8">
        <CustomerLedgerTabs 
          customerId={customer.id}
          units={customer.units}
          selectedUnit={selectedUnit}
        />
      </div>
    </div>
  );
};
