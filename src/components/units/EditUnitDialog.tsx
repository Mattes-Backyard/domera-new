
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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

interface Facility {
  id: string;
  name: string;
}

interface EditUnitDialogProps {
  unit: Unit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUnit: Unit) => void;
  facilities?: Facility[];
}

export const EditUnitDialog = ({ unit, isOpen, onClose, onSave, facilities = [] }: EditUnitDialogProps) => {
  const [formData, setFormData] = useState<Unit>(unit);

  // Update form data when unit prop changes or dialog opens
  useEffect(() => {
    if (isOpen && unit) {
      console.log('Setting form data for unit:', unit);
      setFormData({ ...unit });
    }
  }, [unit, isOpen]);

  const handleSave = () => {
    console.log('Saving unit data:', formData);
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original unit data
    setFormData({ ...unit });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Unit Details - {unit.id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="unitId">Unit ID</Label>
              <Input
                id="unitId"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Extra Large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="facility">Facility</Label>
              <Select value={formData.site} onValueChange={(value) => setFormData(prev => ({ ...prev, site: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.length > 0 ? (
                    facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-facilities" disabled>No facilities available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rate">Monthly Rate ($)</Label>
              <Input
                id="rate"
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData(prev => ({ ...prev, rate: Number(e.target.value) }))}
              />
            </div>
            
            <div>
              <Label htmlFor="tenant">Current Tenant</Label>
              <Input
                id="tenant"
                value={formData.tenant || "No tenant assigned"}
                disabled
                className="bg-gray-50"
                placeholder="No tenant assigned"
              />
              {formData.tenant && (
                <p className="text-sm text-gray-600 mt-1">
                  Tenant ID: {formData.tenantId || 'Unknown'}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="climate"
                checked={formData.climate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, climate: checked }))}
              />
              <Label htmlFor="climate">Climate Controlled</Label>
            </div>

            {formData.status === 'occupied' && formData.tenant && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Unit is currently occupied</p>
                <p className="text-sm text-blue-700">Tenant: {formData.tenant}</p>
                <p className="text-sm text-blue-600 mt-1">
                  To change tenant assignment, use the "Assign Tenant" feature or set status to "available" first.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
