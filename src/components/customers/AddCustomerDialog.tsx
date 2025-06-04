
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DatabaseCustomer } from "@/types/customer";

const availableUnits = [
  { id: "A-102", size: "5x5", rate: 85 },
  { id: "C-301", size: "10x20", rate: 280 },
];

interface AddCustomerDialogProps {
  onSave?: (customer: DatabaseCustomer) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AddCustomerDialog = ({ onSave, isOpen = false, onClose }: AddCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    personalId: "",
    taxId: "",
    assignedUnit: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
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

    // Create new customer object as DatabaseCustomer
    const nameParts = formData.name.split(' ');
    const newCustomer: DatabaseCustomer = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: '',
      state: '',
      zip_code: '',
      emergency_contact_name: formData.emergencyContactName,
      emergency_contact_phone: formData.emergencyContactPhone,
      move_in_date: new Date().toISOString().split('T')[0],
      lease_end_date: undefined,
      security_deposit: undefined,
      balance: 0,
      notes: formData.notes,
      facility_id: '',
      user_id: undefined,
    };

    // Call the callback to add customer to the system
    if (onSave) {
      onSave(newCustomer);
    }

    console.log("New customer data:", {
      customer: newCustomer,
      additionalInfo: {
        personalId: formData.personalId,
        taxId: formData.taxId,
        assignedUnit: formData.assignedUnit,
        emergencyContactRelationship: formData.emergencyContactRelationship,
      }
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
      personalId: "",
      taxId: "",
      assignedUnit: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
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
              <div>
                <Label htmlFor="personalId">Personal ID</Label>
                <Input
                  id="personalId"
                  value={formData.personalId}
                  onChange={(e) => setFormData({ ...formData, personalId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
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

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
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
