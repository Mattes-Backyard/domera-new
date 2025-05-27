
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Unit } from "@/hooks/useUnits";

interface AssignTenantDialogProps {
  unit: Unit;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (tenantId: string, tenantName: string) => void;
}

// Mock customers data - in a real app this would come from props or API
const mockCustomers = [
  { id: "john-smith", name: "John Smith" },
  { id: "sarah-johnson", name: "Sarah Johnson" },
  { id: "mike-wilson", name: "Mike Wilson" },
  { id: "emily-davis", name: "Emily Davis" },
];

export const AssignTenantDialog = ({ unit, isOpen, onClose, onAssign }: AssignTenantDialogProps) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");

  const handleAssign = () => {
    if (selectedTenantId) {
      const selectedCustomer = mockCustomers.find(c => c.id === selectedTenantId);
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
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedTenantId}>
            Assign Tenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
