
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, User, Shield } from "lucide-react";

export const AdminAccessVisualizer = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch current user's profile
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Current user profile from DB:', currentProfile);
      console.log('Profile error:', profileError);
      setDbProfile(currentProfile);

      // Fetch all profiles to see admin users
      const { data: profiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, email, role, first_name, last_name')
        .order('created_at', { ascending: false });
      
      console.log('All profiles:', profiles);
      console.log('All profiles error:', allProfilesError);
      setAllProfiles(profiles || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <div className="p-4">Loading admin access data...</div>;

  const adminUsers = allProfiles.filter(p => p.role === 'admin');
  const currentUserIsAdmin = profile?.role === 'admin';
  const dbProfileIsAdmin = dbProfile?.role === 'admin';

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Access Status
          </CardTitle>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Current User Info
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {user?.id || 'No user'}</div>
                <div><strong>Email:</strong> {user?.email || 'No email'}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Role Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Frontend (useAuth):</span>
                  <Badge variant={currentUserIsAdmin ? 'default' : 'secondary'}>
                    {profile?.role || 'No role'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Database Direct:</span>
                  <Badge variant={dbProfileIsAdmin ? 'default' : 'secondary'}>
                    {dbProfile?.role || 'No role found'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <strong>Admin Menu Access:</strong>
              <Badge variant={currentUserIsAdmin ? 'default' : 'destructive'}>
                {currentUserIsAdmin ? 'GRANTED' : 'DENIED'}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {currentUserIsAdmin 
                ? "✅ You should see 'Admin Panel' under System Settings in sidebar"
                : "❌ Admin Panel menu will not appear in sidebar"
              }
            </div>
          </div>

          {dbProfile && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Raw Database Profile</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(dbProfile, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            All Admin Users ({adminUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {adminUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No admin users found in the database
            </div>
          ) : (
            <div className="space-y-2">
              {adminUsers.map((admin) => (
                <div 
                  key={admin.id} 
                  className={`flex items-center justify-between p-2 rounded border ${
                    admin.id === user?.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">
                      {admin.first_name || admin.last_name 
                        ? `${admin.first_name || ''} ${admin.last_name || ''}`.trim()
                        : 'Unnamed User'
                      }
                    </div>
                    <div className="text-sm text-gray-600">{admin.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Admin</Badge>
                    {admin.id === user?.id && (
                      <Badge variant="outline">You</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Backend Requirements Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="font-medium text-yellow-800">For admin menu to appear, the system requires:</div>
          <ul className="list-disc list-inside space-y-1 text-yellow-700">
            <li>User must be authenticated (have valid session)</li>
            <li>User profile must exist in `profiles` table</li>
            <li>Profile.role must be set to 'admin' (enum value)</li>
            <li>useAuth hook must successfully load the profile data</li>
            <li>DashboardSidebar checks: `profile?.role === 'admin'`</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-100 rounded text-yellow-800">
            <strong>Current Status:</strong> {currentUserIsAdmin ? "✅ All requirements met" : "❌ Missing admin role"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
