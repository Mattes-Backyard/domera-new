
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FiltersSection } from "./FiltersSection";
import { UnitsTable } from "./UnitsTable";
import { BulkActionsSection } from "./BulkActionsSection";
import { useUnits, useUpdateUnit } from "@/hooks/useUnits";

export const OperationsView = () => {
  const { toast } = useToast();
  const { data: units = [], isLoading } = useUnits();
  const updateUnitMutation = useUpdateUnit();
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    size: "all",
  });
  const [bulkChanges, setBulkChanges] = useState({
    status: "",
    rate: "",
    type: "",
  });

  const filteredUnits = units.filter(unit => {
    return (
      (filters.status === "all" || unit.status === filters.status) &&
      (filters.type === "all" || unit.type === filters.type) &&
      (filters.size === "all" || unit.size === filters.size)
    );
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

    // Apply bulk changes to selected units
    selectedUnits.forEach(unitId => {
      const unit = units.find(u => u.id === unitId);
      if (unit) {
        const updatedUnit = { ...unit };
        
        if (bulkChanges.status) {
          updatedUnit.status = bulkChanges.status;
          if (bulkChanges.status === "available" || bulkChanges.status === "maintenance") {
            updatedUnit.tenant = null;
            updatedUnit.tenantId = null;
          }
        }
        
        if (bulkChanges.rate) {
          updatedUnit.rate = parseInt(bulkChanges.rate);
        }
        
        if (bulkChanges.type) {
          updatedUnit.type = bulkChanges.type;
        }
        
        updateUnitMutation.mutate(updatedUnit);
      }
    });

    console.log("Applied bulk changes to units:", selectedUnits, bulkChanges);
    
    toast({
      title: "Changes Applied",
      description: `Successfully updated ${selectedUnits.length} unit${selectedUnits.length > 1 ? 's' : ''}.`,
    });

    setSelectedUnits([]);
    setBulkChanges({ status: "", rate: "", type: "" });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
        <p className="text-gray-600">Filter units and apply bulk changes to multiple units at once</p>
      </div>

      <FiltersSection filters={filters} onFiltersChange={setFilters} />

      <UnitsTable 
        units={filteredUnits}
        selectedUnits={selectedUnits}
        onSelectUnit={handleSelectUnit}
        onSelectAll={handleSelectAll}
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
