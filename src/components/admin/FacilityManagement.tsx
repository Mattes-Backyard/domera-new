
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Edit, Trash2, Building } from "lucide-react";
import { useCompanySettings, type Facility } from "@/hooks/useCompanySettings";
import { toast } from "sonner";

export const FacilityManagement = () => {
  const { facilities, loading, createFacility, updateFacility, deleteFacility } = useCompanySettings();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'Sweden',
    email: '',
    phone: '',
    timezone: 'Europe/Stockholm'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'Sweden',
      email: '',
      phone: '',
      timezone: 'Europe/Stockholm'
    });
  };

  const handleCreate = () => {
    resetForm();
    setEditingFacility(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (facility: Facility) => {
    setFormData({
      name: facility.name || '',
      address: facility.address || '',
      city: facility.city || '',
      state: facility.state || '',
      zip_code: facility.zip_code || '',
      country: facility.country || 'Sweden',
      email: facility.email || '',
      phone: facility.phone || '',
      timezone: facility.timezone || 'Europe/Stockholm'
    });
    setEditingFacility(facility);
    setIsCreateOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    let success = false;
    if (editingFacility) {
      success = await updateFacility(editingFacility.id, formData);
    } else {
      success = await createFacility(formData);
    }

    if (success) {
      setIsCreateOpen(false);
      resetForm();
      setEditingFacility(null);
    }
  };

  const handleDelete = async (facility: Facility) => {
    if (window.confirm(`Are you sure you want to delete ${facility.name}? This action cannot be undone.`)) {
      await deleteFacility(facility.id);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Facility Management</h2>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Facility Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Storage Facility Name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Storage Street"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Stockholm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Stockholm County"
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code">Postal Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                    placeholder="12345"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Sweden"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="facility@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+46 8 123 456 78"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFacility ? 'Update Facility' : 'Create Facility'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {facility.name}
              </CardTitle>
              <CardDescription>
                {facility.address}, {facility.city}
                {facility.state && `, ${facility.state}`}
                {facility.zip_code && ` ${facility.zip_code}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {facility.email && (
                  <p className="text-sm text-muted-foreground">
                    📧 {facility.email}
                  </p>
                )}
                {facility.phone && (
                  <p className="text-sm text-muted-foreground">
                    📞 {facility.phone}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary">{facility.country}</Badge>
                  {facility.timezone && (
                    <Badge variant="outline">{facility.timezone}</Badge>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(facility)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(facility)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {facilities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No facilities yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first facility to start managing storage locations.
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Facility
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
