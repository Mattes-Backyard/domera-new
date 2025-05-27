
import { useMemo, useState, useEffect } from "react";
import { UnitGridHeader } from "./UnitGridHeader";
import { UnitCard } from "./UnitCard";
import { EmptyUnitsState } from "./EmptyUnitsState";
import { ClientCard } from "@/components/clients/ClientCard";
import { UnitDetailsPage } from "./UnitDetailsPage";
import { AddUnitDialog } from "./AddUnitDialog";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate_controlled: boolean;
}

interface UnitGridProps {
  searchQuery?: string;
  selectedUnitId?: string | null;
  onClearSelection?: () => void;
  units?: Unit[];
  onUnitSelect?: (unit: Unit) => void;
  onUnitAdd?: (newUnit: Unit) => void;
  triggerAddDialog?: boolean;
  onAddDialogClose?: () => void;
  onTenantClick?: (tenantId: string) => void;
}

export const UnitGrid = ({ 
  searchQuery = "", 
  selectedUnitId, 
  onClearSelection, 
  units = [], 
  onUnitSelect, 
  onUnitAdd,
  triggerAddDialog = false,
  onAddDialogClose,
  onTenantClick
}: UnitGridProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (triggerAddDialog) {
      setIsAddDialogOpen(true);
    }
  }, [triggerAddDialog]);

  const filteredUnits = useMemo(() => {
    if (selectedUnitId) {
      return units.filter(unit => unit.id === selectedUnitId);
    }
    
    if (!searchQuery.trim()) return units;
    
    const query = searchQuery.toLowerCase();
    return units.filter(unit => 
      unit.id.toLowerCase().includes(query) ||
      unit.size.toLowerCase().includes(query) ||
      unit.type.toLowerCase().includes(query) ||
      unit.status.toLowerCase().includes(query) ||
      (unit.tenant && unit.tenant.toLowerCase().includes(query))
    );
  }, [searchQuery, selectedUnitId, units]);

  useEffect(() => {
    if (selectedUnitId && filteredUnits.length === 0) {
      onClearSelection?.();
    }
  }, [selectedUnitId, filteredUnits.length, onClearSelection]);

  const handleTenantClick = (tenantId: string) => {
    if (onTenantClick) {
      onTenantClick(tenantId);
    } else {
      setSelectedClientId(tenantId);
    }
  };

  const handleViewDetails = (unit: Unit) => {
    onUnitSelect?.(unit);
  };

  const handleBackFromDetails = () => {
    setViewingUnitDetails(null);
  };

  const handleUnitAdd = (newUnit: Unit) => {
    onUnitAdd?.(newUnit);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    onAddDialogClose?.();
  };

  if (viewingUnitDetails) {
    return (
      <UnitDetailsPage 
        unit={viewingUnitDetails} 
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <div className="p-6">
      <UnitGridHeader
        searchQuery={searchQuery}
        selectedUnitId={selectedUnitId}
        filteredUnitsCount={filteredUnits.length}
        onAddUnit={() => setIsAddDialogOpen(true)}
        onClearSelection={onClearSelection}
      />
      
      {filteredUnits.length === 0 && searchQuery && !selectedUnitId ? (
        <EmptyUnitsState searchQuery={searchQuery} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isSelected={selectedUnitId === unit.id}
              onTenantClick={handleTenantClick}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {selectedClientId && (
        <ClientCard
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}

      <AddUnitDialog
        isOpen={isAddDialogOpen}
        onClose={handleAddDialogClose}
        onSave={handleUnitAdd}
      />
    </div>
  );
};
