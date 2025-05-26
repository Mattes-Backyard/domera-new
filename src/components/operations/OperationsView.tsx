
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, Edit3, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

    // Apply the actual changes to the units
    setUnits(prevUnits => 
      prevUnits.map(unit => {
        if (selectedUnits.includes(unit.id)) {
          const updatedUnit = { ...unit };
          
          // Apply status change if provided
          if (bulkChanges.status) {
            updatedUnit.status = bulkChanges.status as "available" | "occupied" | "reserved" | "maintenance";
            // Clear tenant if status changes to available or maintenance
            if (bulkChanges.status === "available" || bulkChanges.status === "maintenance") {
              updatedUnit.tenant = null;
            }
          }
          
          // Apply rate change if provided
          if (bulkChanges.rate) {
            updatedUnit.rate = parseInt(bulkChanges.rate);
          }
          
          // Apply type change if provided
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

    // Reset selections and bulk changes
    setSelectedUnits([]);
    setBulkChanges({ status: "", rate: "", type: "" });
  };

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
        <p className="text-gray-600">Filter units and apply bulk changes to multiple units at once</p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
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
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
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
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select value={filters.size} onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}>
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
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Units ({filteredUnits.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedUnits.length === filteredUnits.length && filteredUnits.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label>Select All</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedUnits.includes(unit.id)}
                    onCheckedChange={() => handleSelectUnit(unit.id)}
                  />
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold">{unit.id}</div>
                    <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                    <div className="text-sm text-gray-600">{unit.size} • {unit.type}</div>
                    {unit.tenant && (
                      <div className="text-sm text-blue-600">{unit.tenant}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="font-semibold">${unit.rate}/month</div>
                  {unit.climate && (
                    <Badge variant="outline" className="text-xs">Climate</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Section - Now positioned after units */}
      {selectedUnits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Bulk Actions ({selectedUnits.length} units selected)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Change Status</Label>
                <Select value={bulkChanges.status} onValueChange={(value) => setBulkChanges(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Change Rate ($)</Label>
                <Input
                  type="number"
                  placeholder="New rate"
                  value={bulkChanges.rate}
                  onChange={(e) => setBulkChanges(prev => ({ ...prev, rate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Change Type</Label>
                <Select value={bulkChanges.type} onValueChange={(value) => setBulkChanges(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApplyBulkChanges} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Apply Changes
              </Button>
              <Button variant="outline" onClick={() => setSelectedUnits([])}>
                <X className="h-4 w-4" />
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
