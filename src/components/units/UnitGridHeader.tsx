
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface UnitGridHeaderProps {
  searchQuery: string;
  selectedUnitId: string | null;
  filteredUnitsCount: number;
  onAddUnit: () => void;
  onClearSelection?: () => void;
}

export const UnitGridHeader = ({ 
  searchQuery, 
  selectedUnitId, 
  filteredUnitsCount, 
  onAddUnit, 
  onClearSelection 
}: UnitGridHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Management</h1>
          <p className="text-gray-600">
            Manage your storage units and track occupancy
            {searchQuery && !selectedUnitId && (
              <span className="ml-2 text-sm text-blue-600">
                • {filteredUnitsCount} result{filteredUnitsCount !== 1 ? 's' : ''} for "{searchQuery}"
              </span>
            )}
            {selectedUnitId && (
              <span className="ml-2 text-sm text-blue-600">
                • Showing unit {selectedUnitId}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onAddUnit} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
          {selectedUnitId && (
            <Button variant="outline" onClick={onClearSelection} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
