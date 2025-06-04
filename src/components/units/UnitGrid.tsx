import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, Filter, X, Plus, Thermometer, MapPin, Menu } from "lucide-react";
import { AddUnitDialog } from "./AddUnitDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const isMobile = useIsMobile();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const getFacilityColor = (site: string) => {
    switch (site) {
      case "helsingborg":
        return "bg-blue-100 text-blue-800";
      case "lund":
        return "bg-green-100 text-green-800";
      case "malmö":
        return "bg-purple-100 text-purple-800";
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
        unit.site.toLowerCase().includes(query) ||
        (unit.tenant && unit.tenant.toLowerCase().includes(query));
      
      const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
      const matchesType = typeFilter === "all" || unit.type === typeFilter;
      const matchesSize = sizeFilter === "all" || unit.size === sizeFilter;
      const matchesFacility = facilityFilter === "all" || unit.site === facilityFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesSize && matchesFacility;
    });
  }, [searchQuery, localSearchQuery, selectedUnitId, units, statusFilter, typeFilter, sizeFilter, facilityFilter]);

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

  // Get unique facilities for the filter dropdown
  const availableFacilities = useMemo(() => {
    const sites = [...new Set(units.map(unit => unit.site))];
    return sites.sort();
  }, [units]);

  const FilterContent = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      <div className="relative lg:col-span-2">
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
          <SelectItem value="Extra Large">Extra Large</SelectItem>
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
          <SelectItem value="8x8">8x8</SelectItem>
          <SelectItem value="8x10">8x10</SelectItem>
          <SelectItem value="10x10">10x10</SelectItem>
          <SelectItem value="10x15">10x15</SelectItem>
          <SelectItem value="10x20">10x20</SelectItem>
          <SelectItem value="12x12">12x12</SelectItem>
          <SelectItem value="12x15">12x15</SelectItem>
          <SelectItem value="12x20">12x20</SelectItem>
          <SelectItem value="15x20">15x20</SelectItem>
          <SelectItem value="15x25">15x25</SelectItem>
          <SelectItem value="20x20">20x20</SelectItem>
        </SelectContent>
      </Select>

      <Select value={facilityFilter} onValueChange={setFacilityFilter}>
        <SelectTrigger>
          <SelectValue placeholder="All facilities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All facilities</SelectItem>
          {availableFacilities.map((site) => (
            <SelectItem key={site} value={site}>
              {site.charAt(0).toUpperCase() + site.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const MobileUnitCard = ({ unit }: { unit: Unit }) => (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${selectedUnitId === unit.id ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => handleUnitClick(unit)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{unit.id}</div>
              <div className="text-sm text-gray-500">{unit.size}</div>
            </div>
          </div>
          <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-600">Facility:</span>
            <Badge className={`${getFacilityColor(unit.site)} ml-1`} variant="outline">
              {unit.site.charAt(0).toUpperCase() + unit.site.slice(1)}
            </Badge>
          </div>
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-1 font-medium">{unit.type}</span>
          </div>
          <div>
            <span className="text-gray-600">Rate:</span>
            <span className="ml-1 font-semibold">${unit.rate}/month</span>
          </div>
          <div>
            {unit.tenant && unit.tenantId ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTenantClick(unit.tenantId!);
                }}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                {unit.tenant}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">No tenant</span>
            )}
          </div>
        </div>
        
        {unit.climate && (
          <Badge variant="outline" className="text-xs">
            <Thermometer className="h-3 w-3 mr-1" />
            Climate
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Unit Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your storage units and track occupancy ({filteredUnits.length} of {units.length} units)
              {selectedUnitId && (
                <span className="ml-2 text-sm text-blue-600">
                  • Showing unit {selectedUnitId}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedUnitId && (
              <Button variant="outline" onClick={onClearSelection} className="flex items-center gap-2" size={isMobile ? "sm" : "default"}>
                <X className="h-4 w-4" />
                Clear Selection
              </Button>
            )}
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="flex items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <Plus className="h-4 w-4" />
              Add Unit
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            {isMobile && (
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Filter and search your units
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setLocalSearchQuery("");
                        setStatusFilter("all");
                        setTypeFilter("all");
                        setSizeFilter("all");
                        setFacilityFilter("all");
                      }}
                      className="w-full mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </CardHeader>
        {!isMobile && (
          <CardContent>
            <FilterContent />
            <Button 
              variant="outline" 
              onClick={() => {
                setLocalSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
                setSizeFilter("all");
                setFacilityFilter("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Units Display */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredUnits.map((unit) => (
            <MobileUnitCard key={unit.id} unit={unit} />
          ))}
          {filteredUnits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No units found matching your criteria.
            </div>
          )}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Facility</TableHead>
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
                      <Badge className={getFacilityColor(unit.site)} variant="outline">
                        {unit.site.charAt(0).toUpperCase() + unit.site.slice(1)}
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
          </div>
          
          {filteredUnits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No units found matching your criteria.
            </div>
          )}
        </Card>
      )}

      <AddUnitDialog
        isOpen={isAddDialogOpen}
        onClose={handleAddDialogClose}
        onSave={handleUnitAdd}
      />
    </div>
  );
};
