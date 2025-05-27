
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Unit } from "@/hooks/useUnits";

interface EditUnitDialogProps {
  unit: Unit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUnit: Unit) => void;
}

export const EditUnitDialog = ({ unit, isOpen, onClose, onSave }: EditUnitDialogProps) => {
  const [formData, setFormData] = useState<Unit>(unit);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(unit);
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
              <Label htmlFor="tenant">Tenant Name</Label>
              <Input
                id="tenant"
                value={formData.tenant || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, tenant: e.target.value || null }))}
                placeholder="Leave empty if no tenant"
              />
            </div>
            
            <div>
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input
                id="tenantId"
                value={formData.tenantId || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, tenantId: e.target.value || null, tenant_id: e.target.value || null }))}
                placeholder="Leave empty if no tenant"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="climate"
                checked={formData.climate_controlled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, climate_controlled: checked }))}
              />
              <Label htmlFor="climate">Climate Controlled</Label>
            </div>
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
