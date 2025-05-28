
import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, Filter, X, Plus, Thermometer, MapPin } from "lucide-react";
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
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (triggerAddDialog) {
      setIsAddDialogOpen(true);
    }
  }, [triggerAddDialog]);

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

  const filteredUnits = useMemo(() => {
    if (selectedUnitId) {
      return units.filter(unit => unit.id === selectedUnitId);
    }
    
    const query = (searchQuery || localSearchQuery).toLowerCase();
    return units.filter(unit => {
      const matchesSearch = !query || 
        unit.id.toLowerCase().includes(query) ||
        unit.size.toLowerCase().includes(query) ||
        unit.type.toLowerCase().includes(query) ||
        unit.status.toLowerCase().includes(query) ||
        (unit.tenant && unit.tenant.toLowerCase().includes(query));
      
      const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
      const matchesType = typeFilter === "all" || unit.type === typeFilter;
      const matchesSize = sizeFilter === "all" || unit.size === sizeFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesSize;
    });
  }, [searchQuery, localSearchQuery, selectedUnitId, units, statusFilter, typeFilter, sizeFilter]);

  useEffect(() => {
    if (selectedUnitId && filteredUnits.length === 0) {
      onClearSelection?.();
    }
  }, [selectedUnitId, filteredUnits.length, onClearSelection]);

  const handleTenantClick = (tenantId: string) => {
    if (onTenantClick) {
      onTenantClick(tenantId);
    }
  };

  const handleUnitClick = (unit: Unit) => {
    console.log("Unit clicked:", unit.id);
    onUnitSelect?.(unit);
  };

  const handleUnitAdd = (newUnit: Unit) => {
    onUnitAdd?.(newUnit);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    onAddDialogClose?.();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Management</h1>
          <p className="text-gray-600">
            Manage your storage units and track occupancy ({filteredUnits.length} of {units.length} units)
            {selectedUnitId && (
              <span className="ml-2 text-sm text-blue-600">
                • Showing unit {selectedUnitId}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedUnitId && (
            <Button variant="outline" onClick={onClearSelection} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
          )}
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search units..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Large">Large</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              <SelectItem value="5x5">5x5</SelectItem>
              <SelectItem value="5x10">5x10</SelectItem>
              <SelectItem value="10x10">10x10</SelectItem>
              <SelectItem value="10x20">10x20</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setLocalSearchQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
              setSizeFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Features</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => (
              <TableRow 
                key={unit.id} 
                className={`cursor-pointer hover:bg-gray-50 ${selectedUnitId === unit.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleUnitClick(unit)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{unit.id}</div>
                      <div className="text-sm text-gray-500">{unit.size}</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={getStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {unit.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      Size: {unit.size}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {unit.tenant && unit.tenantId ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTenantClick(unit.tenantId!);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {unit.tenant}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">None</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    ${unit.rate}/month
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {unit.climate && (
                      <Badge variant="outline" className="text-xs">
                        <Thermometer className="h-3 w-3 mr-1" />
                        Climate
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnitClick(unit);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredUnits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No units found matching your criteria.
          </div>
        )}
      </Card>

      <AddUnitDialog
        isOpen={isAddDialogOpen}
        onClose={handleAddDialogClose}
        onSave={handleUnitAdd}
      />
    </div>
  );
};
