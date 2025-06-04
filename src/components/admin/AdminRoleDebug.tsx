
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AdminRoleDebug = () => {
  const { user, profile } = useAuth();
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        console.log('Profile data from DB:', data);
        console.log('Profile error:', error);
        setDbProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <div>Loading profile debug...</div>;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Access Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>User ID:</strong> {user?.id || 'No user'}
        </div>
        <div>
          <strong>User Email:</strong> {user?.email || 'No email'}
        </div>
        <div>
          <strong>Profile from useAuth:</strong> 
          <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
            {profile?.role || 'No role'}
          </Badge>
        </div>
        <div>
          <strong>Profile from Database:</strong>
          <Badge variant={dbProfile?.role === 'admin' ? 'default' : 'secondary'}>
            {dbProfile?.role || 'No role found'}
          </Badge>
        </div>
        <div>
          <strong>Admin Access Should Show:</strong>
          <Badge variant={profile?.role === 'admin' ? 'default' : 'destructive'}>
            {profile?.role === 'admin' ? 'YES' : 'NO'}
          </Badge>
        </div>
        {dbProfile && (
          <div>
            <strong>Full DB Profile:</strong>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(dbProfile, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
