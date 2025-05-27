
import { useState } from "react";
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
}

interface AddUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUnit: Unit) => void;
}

export const AddUnitDialog = ({ isOpen, onClose, onSave }: AddUnitDialogProps) => {
  const [formData, setFormData] = useState<Unit>({
    id: "",
    size: "",
    type: "Standard",
    status: "available",
    tenant: null,
    tenantId: null,
    rate: 0,
    climate: false,
  });

  const handleSave = () => {
    if (!formData.id || !formData.size || !formData.rate) {
      return; // Basic validation
    }
    
    onSave(formData);
    onClose();
    
    // Reset form
    setFormData({
      id: "",
      size: "",
      type: "Standard",
      status: "available",
      tenant: null,
      tenantId: null,
      rate: 0,
      climate: false,
    });
  };

  const handleCancel = () => {
    setFormData({
      id: "",
      size: "",
      type: "Standard",
      status: "available",
      tenant: null,
      tenantId: null,
      rate: 0,
      climate: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="unitId">Unit ID *</Label>
              <Input
                id="unitId"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="e.g., A-101"
              />
            </div>
            
            <div>
              <Label htmlFor="size">Size *</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                placeholder="e.g., 5x5"
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
              <Label htmlFor="rate">Monthly Rate ($) *</Label>
              <Input
                id="rate"
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData(prev => ({ ...prev, rate: Number(e.target.value) }))}
                placeholder="0"
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
                onChange={(e) => setFormData(prev => ({ ...prev, tenantId: e.target.value || null }))}
                placeholder="Leave empty if no tenant"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="climate"
                checked={formData.climate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, climate: checked }))}
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
            Add Unit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
