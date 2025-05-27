
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";
import type { Unit } from "@/hooks/useUnits";

interface AssignTenantDialogProps {
  unit: Unit;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (tenantId: string, tenantName: string) => void;
}

export const AssignTenantDialog = ({ unit, isOpen, onClose, onAssign }: AssignTenantDialogProps) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const { data: customers = [] } = useCustomers();

  // Filter customers who don't already have units assigned or have status "former"
  const availableCustomers = customers.filter(customer => 
    customer.units.length === 0 || customer.status === "former"
  );

  const handleAssign = () => {
    if (selectedTenantId) {
      const selectedCustomer = availableCustomers.find(c => c.id === selectedTenantId);
      if (selectedCustomer) {
        onAssign(selectedTenantId, selectedCustomer.name);
        setSelectedTenantId("");
        onClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedTenantId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Tenant to Unit {unit.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tenant">Select Tenant</Label>
            <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a tenant..." />
              </SelectTrigger>
              <SelectContent>
                {availableCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableCustomers.length === 0 && (
              <p className="text-sm text-gray-500">No available customers. All customers are already assigned to units.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedTenantId || availableCustomers.length === 0}>
            Assign Tenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
