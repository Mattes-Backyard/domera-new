import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, Shield, Building } from "lucide-react";

export const ProfileView = () => {
  const { user, profile } = useAuth();

  const getInitials = () => {
    if (!profile?.first_name && !profile?.last_name) {
      return user?.email?.charAt(0).toUpperCase() || 'U';
    }
    return `${profile?.first_name?.charAt(0) || ''}${profile?.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
    }
    return 'User';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={getDisplayName()} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{getDisplayName()}</CardTitle>
            {profile?.role && (
              <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                <Shield className="mr-1 h-3 w-3" />
                {profile.role}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>Member since {formatDate(profile?.created_at)}</p>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="text-gray-900">{profile?.first_name || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-gray-900">{profile?.last_name || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="text-gray-900">{user?.email || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone
                </label>
                <p className="text-gray-900">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-gray-900 font-mono text-sm">{user?.id || 'Not available'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Access Level</label>
                <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                  {profile?.role || 'No role assigned'}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created At
                </label>
                <p className="text-gray-900">{formatDate(profile?.created_at)}</p>
              </div>
            </div>
            
            {profile?.facility_id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    Facility
                  </label>
                  <p className="text-gray-900">{profile.facility_id}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};