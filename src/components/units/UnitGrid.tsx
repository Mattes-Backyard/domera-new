
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Thermometer, Lock } from "lucide-react";
import { useMemo } from "react";

const units = [
  { id: "A-101", size: "5x5", type: "Standard", status: "occupied", tenant: "John Smith", rate: 85, climate: true },
  { id: "A-102", size: "5x5", type: "Standard", status: "available", tenant: null, rate: 85, climate: true },
  { id: "A-103", size: "5x10", type: "Standard", status: "reserved", tenant: "Sarah Johnson", rate: 120, climate: true },
  { id: "B-201", size: "10x10", type: "Premium", status: "occupied", tenant: "Mike Wilson", rate: 180, climate: true },
  { id: "B-202", size: "10x10", type: "Premium", status: "maintenance", tenant: null, rate: 180, climate: true },
  { id: "C-301", size: "10x20", type: "Large", status: "available", tenant: null, rate: 280, climate: false },
];

interface UnitGridProps {
  searchQuery?: string;
}

export const UnitGrid = ({ searchQuery = "" }: UnitGridProps) => {
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return units;
    
    const query = searchQuery.toLowerCase();
    return units.filter(unit => 
      unit.id.toLowerCase().includes(query) ||
      unit.size.toLowerCase().includes(query) ||
      unit.type.toLowerCase().includes(query) ||
      unit.status.toLowerCase().includes(query) ||
      (unit.tenant && unit.tenant.toLowerCase().includes(query))
    );
  }, [searchQuery]);

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unit Management</h1>
        <p className="text-gray-600">
          Manage your storage units and track occupancy
          {searchQuery && (
            <span className="ml-2 text-sm text-blue-600">
              • {filteredUnits.length} result{filteredUnits.length !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
          )}
        </p>
      </div>
      
      {filteredUnits.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No units found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow duration-200">
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
                  
                  {unit.tenant && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tenant:</span>
                      <span className="text-sm font-medium text-gray-900">{unit.tenant}</span>
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
                  
                  <Button variant="outline" className="w-full mt-3">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
