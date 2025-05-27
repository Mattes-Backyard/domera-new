
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUnits } from "@/hooks/useUnits";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  status: string;
  joinDate: string;
  balance: number;
  address?: string;
  ssn?: string;
}

interface AddCustomerDialogProps {
  onSave?: (customer: Customer) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AddCustomerDialog = ({ onSave, isOpen = false, onClose }: AddCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: units = [] } = useUnits();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    ssn: "",
    assignedUnit: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  // Get available units (not occupied)
  const availableUnits = units.filter(unit => unit.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate ID based on name
    const customerId = formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    // Create new customer object matching database schema
    const newCustomer: Customer = {
      id: customerId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      units: formData.assignedUnit ? [formData.assignedUnit] : [],
      status: formData.assignedUnit ? "active" : "former",
      joinDate: new Date().toISOString().split('T')[0],
      balance: 0,
      address: formData.address || null,
      ssn: formData.ssn || null,
    };

    // Call the callback to add customer to the system
    if (onSave) {
      onSave(newCustomer);
    }

    console.log("New customer data:", {
      customer: newCustomer,
      notes: formData.notes,
    });
    
    toast({
      title: "Success",
      description: `Customer ${formData.name} has been added successfully${formData.assignedUnit ? ` and assigned to unit ${formData.assignedUnit}` : ""}`,
    });

    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      ssn: "",
      assignedUnit: "",
      notes: "",
    });
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isOpen && (
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Add New Customer</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="ssn">SSN</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Unit Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Unit Assignment (Optional)</h3>
            <div>
              <Label htmlFor="assignedUnit">Assign Unit</Label>
              <Select value={formData.assignedUnit} onValueChange={(value) => setFormData({ ...formData, assignedUnit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.id} - {unit.size} (${unit.rate}/month)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Notes</h3>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information about the customer..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
