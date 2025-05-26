
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FiltersSection } from "./FiltersSection";
import { UnitsTable } from "./UnitsTable";
import { BulkActionsSection } from "./BulkActionsSection";

const initialUnits = [
  { id: "A-101", size: "5x5", type: "Standard", status: "occupied", tenant: "John Smith", rate: 85, climate: true },
  { id: "A-102", size: "5x5", type: "Standard", status: "available", tenant: null, rate: 85, climate: true },
  { id: "A-103", size: "5x10", type: "Standard", status: "reserved", tenant: "Sarah Johnson", rate: 120, climate: true },
  { id: "B-201", size: "10x10", type: "Premium", status: "occupied", tenant: "Mike Wilson", rate: 180, climate: true },
  { id: "B-202", size: "10x10", type: "Premium", status: "maintenance", tenant: null, rate: 180, climate: true },
  { id: "C-301", size: "10x20", type: "Large", status: "available", tenant: null, rate: 280, climate: false },
];

export const OperationsView = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState(initialUnits);
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

    setUnits(prevUnits => 
      prevUnits.map(unit => {
        if (selectedUnits.includes(unit.id)) {
          const updatedUnit = { ...unit };
          
          if (bulkChanges.status) {
            updatedUnit.status = bulkChanges.status as "available" | "occupied" | "reserved" | "maintenance";
            if (bulkChanges.status === "available" || bulkChanges.status === "maintenance") {
              updatedUnit.tenant = null;
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
      })
    );

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
