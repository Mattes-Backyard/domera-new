import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Thermometer, Lock, X, Plus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
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
  climate: boolean;
}

interface UnitGridProps {
  searchQuery?: string;
  selectedUnitId?: string | null;
  onClearSelection?: () => void;
  units?: Unit[];
  onUnitSelect?: (unit: Unit) => void;
  onUnitAdd?: (newUnit: Unit) => void;
}

export const UnitGrid = ({ searchQuery = "", selectedUnitId, onClearSelection, units = [], onUnitSelect, onUnitAdd }: UnitGridProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTenantClick = (tenantId: string) => {
    setSelectedClientId(tenantId);
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
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unit Management</h1>
            <p className="text-gray-600">
              Manage your storage units and track occupancy
              {searchQuery && !selectedUnitId && (
                <span className="ml-2 text-sm text-blue-600">
                  • {filteredUnits.length} result{filteredUnits.length !== 1 ? 's' : ''} for "{searchQuery}"
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
              onClick={() => setIsAddDialogOpen(true)} 
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
      
      {filteredUnits.length === 0 && searchQuery && !selectedUnitId ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No units found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className={`hover:shadow-lg transition-shadow duration-200 ${selectedUnitId === unit.id ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {unit.id}
                  </CardTitle>
                  <Badge className={getStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{unit.size}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{unit.type}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Rate:</span>
                    <span className="font-semibold text-gray-900">${unit.rate}</span>
                  </div>
                  
                  {unit.tenant && unit.tenantId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tenant:</span>
                      <button
                        onClick={() => handleTenantClick(unit.tenantId!)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {unit.tenant}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {unit.climate && (
                      <Badge variant="outline" className="text-xs">
                        <Thermometer className="h-3 w-3 mr-1" />
                        Climate
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => handleViewDetails(unit)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleUnitAdd}
      />
    </div>
  );
};
