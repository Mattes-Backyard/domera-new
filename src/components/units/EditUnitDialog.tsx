import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AddCommentForm } from "./AddCommentForm";

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

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const { user } = useAuth();

  // Fetch current customer information when dialog opens
  useEffect(() => {
    const fetchCurrentCustomer = async () => {
      if (!isOpen || !unit.id) return;

      try {
        // Get the unit's UUID from the database
        const { data: unitData } = await supabase
          .from('units')
          .select('id')
          .eq('unit_number', unit.id)
          .single();

        if (!unitData) return;

        // Get active rental for this unit
        const { data: rentalData } = await supabase
          .from('unit_rentals')
          .select(`
            customer:customers (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('unit_id', unitData.id)
          .eq('is_active', true)
          .single();

        if (rentalData?.customer) {
          setCurrentCustomer(rentalData.customer as Customer);
        } else {
          setCurrentCustomer(null);
        }
      } catch (error) {
        console.error('Error fetching current customer:', error);
        setCurrentCustomer(null);
      }
    };

    fetchCurrentCustomer();
  }, [isOpen, unit.id]);

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

  const addComment = async (commentText: string) => {
    if (!user || !commentText.trim()) return;

    try {
      // Get the unit's UUID from the database
      const { data: unitData } = await supabase
        .from('units')
        .select('id')
        .eq('unit_number', unit.id)
        .single();

      if (!unitData) {
        console.error('Unit not found');
        return;
      }

      // Get user's profile for name information
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      const authorName = profileData 
        ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
        : user.email || 'Unknown User';

      // Insert the comment
      const { error } = await supabase
        .from('unit_comments')
        .insert({
          unit_id: unitData.id,
          author_id: user.id,
          author_name: authorName,
          comment_text: commentText.trim()
        });

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      console.log('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
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
              <Label htmlFor="customer">Current Customer</Label>
              {currentCustomer ? (
                <div className="space-y-2">
                  <Input
                    id="customer"
                    value={`${currentCustomer.first_name} ${currentCustomer.last_name}`}
                    disabled
                    className="bg-gray-50"
                  />
                  <div className="text-sm text-gray-600">
                    <p>Email: {currentCustomer.email}</p>
                    <p>Phone: {currentCustomer.phone}</p>
                    <p>Customer ID: {currentCustomer.id}</p>
                  </div>
                </div>
              ) : (
                <Input
                  id="customer"
                  value="No customer assigned"
                  disabled
                  className="bg-gray-50"
                  placeholder="No customer assigned"
                />
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

            {formData.status === 'occupied' && currentCustomer && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Unit is currently occupied</p>
                <p className="text-sm text-blue-700">Customer: {currentCustomer.first_name} {currentCustomer.last_name}</p>
                <p className="text-sm text-blue-600 mt-1">
                  To change customer assignment, use the "Assign Customer" feature or set status to "available" first.
                </p>
              </div>
            )}

            {/* Quick Add Comment Section */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Quick Add Comment</Label>
              <div className="mt-2">
                <AddCommentForm onAddComment={addComment} />
              </div>
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
