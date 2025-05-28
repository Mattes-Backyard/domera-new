import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FiltersSection } from "./FiltersSection";
import { UnitsTable } from "./UnitsTable";
import { BulkActionsSection } from "./BulkActionsSection";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId?: string | null;
  rate: number;
  climate: boolean;
  site: string;
}

interface OperationsViewProps {
  units?: Unit[];
  onTenantClick?: (tenantId: string) => void;
  onUnitsUpdate?: (units: Unit[]) => void;
  selectedSites?: string[];
}

export const OperationsView = ({ units = [], onTenantClick, onUnitsUpdate, selectedSites = ["helsingborg"] }: OperationsViewProps) => {
  const { toast } = useToast();
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    size: "all",
    site: "all",
  });
  const [bulkChanges, setBulkChanges] = useState({
    status: "",
    rate: "",
    type: "",
  });

  const filteredUnits = units.filter(unit => {
    // Filter by selected sites first
    const inSelectedSites = selectedSites.includes(unit.site);
    
    return inSelectedSites &&
      (filters.status === "all" || unit.status === filters.status) &&
      (filters.type === "all" || unit.type === filters.type) &&
      (filters.size === "all" || unit.size === filters.size) &&
      (filters.site === "all" || unit.site === filters.site);
  });

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUnits.length === filteredUnits.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(filteredUnits.map(unit => unit.id));
    }
  };

  const handleApplyBulkChanges = () => {
    if (selectedUnits.length === 0) {
      toast({
        title: "No units selected",
        description: "Please select at least one unit to apply changes.",
        variant: "destructive",
      });
      return;
    }

    if (onUnitsUpdate) {
      const updatedUnits = units.map(unit => {
        if (selectedUnits.includes(unit.id)) {
          const updatedUnit = { ...unit };
          
          if (bulkChanges.status) {
            updatedUnit.status = bulkChanges.status as "available" | "occupied" | "reserved" | "maintenance";
            if (bulkChanges.status === "available" || bulkChanges.status === "maintenance") {
              updatedUnit.tenant = null;
              updatedUnit.tenantId = null;
            }
          }
          
          if (bulkChanges.rate) {
            updatedUnit.rate = parseInt(bulkChanges.rate);
          }
          
          if (bulkChanges.type) {
            updatedUnit.type = bulkChanges.type as "Standard" | "Premium" | "Large";
          }
          
          return updatedUnit;
        }
        return unit;
      });
      
      onUnitsUpdate(updatedUnits);
    }

    console.log("Applied bulk changes to units:", selectedUnits, bulkChanges);
    
    toast({
      title: "Changes Applied",
      description: `Successfully updated ${selectedUnits.length} unit${selectedUnits.length > 1 ? 's' : ''}.`,
    });

    setSelectedUnits([]);
    setBulkChanges({ status: "", rate: "", type: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
        <p className="text-gray-600">
          Filter units and apply bulk changes to multiple units at once 
          ({filteredUnits.length} of {units.filter(u => selectedSites.includes(u.site)).length} units shown)
        </p>
      </div>

      <FiltersSection filters={filters} onFiltersChange={setFilters} />

      <UnitsTable 
        units={filteredUnits}
        selectedUnits={selectedUnits}
        onSelectUnit={handleSelectUnit}
        onSelectAll={handleSelectAll}
        onTenantClick={onTenantClick}
      />

      <BulkActionsSection
        selectedUnits={selectedUnits}
        bulkChanges={bulkChanges}
        onBulkChangesChange={setBulkChanges}
        onApplyChanges={handleApplyBulkChanges}
        onClearSelection={() => setSelectedUnits([])}
      />
    </div>
  );
};
