
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AddUserDialog } from './AddUserDialog';

interface ProfileData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'manager' | 'customer';
  facility_id: string | null;
  created_at: string;
}

interface FacilityData {
  id: string;
  name: string;
  city: string;
}

export const AdminInterface = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProfiles();
    fetchFacilities();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching profiles');
      console.error('Error:', error);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from('facilities')
      .select('id, name, city');

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }
  };

  const assignMathiasToAllFacilities = async () => {
    // Mathias's user ID from auth logs
    const mathiasUserId = 'fd5f9f9b-ac59-4af4-ac1b-d3cd87da0158';
    
    // Update Mathias to admin role with no specific facility (admin has access to all)
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin',
        facility_id: null // Admin doesn't need a specific facility
      })
      .eq('id', mathiasUserId);

    if (error) {
      toast.error('Error updating Mathias profile');
      console.error('Error:', error);
    } else {
      toast.success('Mathias has been granted admin access to all facilities');
      fetchProfiles();
    }
  };

  const updateUserRole = async (userId: string, newRole: string, facilityId?: string) => {
    const updateData: any = { role: newRole };
    if (newRole === 'manager' && facilityId) {
      updateData.facility_id = facilityId;
    } else if (newRole !== 'manager') {
      updateData.facility_id = null;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      toast.error('Error updating user role');
      console.error('Error:', error);
    } else {
      toast.success('User role updated successfully');
      fetchProfiles();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'manager': return 'bg-blue-500';
      case 'customer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Interface</h1>
          <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={assignMathiasToAllFacilities} className="bg-blue-600 hover:bg-blue-700">
            Grant Mathias Admin Access
          </Button>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{profiles.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
            <AddUserDialog facilities={facilities} onUserAdded={fetchProfiles} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {profile.first_name && profile.last_name 
                            ? `${profile.first_name} ${profile.last_name}` 
                            : 'No name set'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(profile.role)} text-white`}>
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {profile.facility_id ? (
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span className="text-sm">
                            {facilities.find(f => f.id === profile.facility_id)?.name || 'Unknown'}
                          </span>
                        </div>
                      ) : profile.role === 'admin' ? (
                        <span className="text-green-600 font-medium">All Facilities</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={profile.role}
                          onValueChange={(newRole) => {
                            if (newRole === 'manager') {
                              // For managers, we need to select a facility
                              const facilityId = prompt('Select facility ID for this manager:');
                              if (facilityId) {
                                updateUserRole(profile.id, newRole, facilityId);
                              }
                            } else {
                              updateUserRole(profile.id, newRole);
                            }
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
