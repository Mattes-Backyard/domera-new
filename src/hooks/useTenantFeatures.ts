
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TenantFeature {
  id: string;
  tenant_id: string;
  feature_name: string;
  enabled: boolean;
  config: any;
}

export interface TenantPermission {
  id: string;
  tenant_id: string;
  role: string;
  permission_name: string;
  granted: boolean;
}

type UserRole = 'admin' | 'manager' | 'customer';

export const useTenantFeatures = () => {
  const { user, profile } = useAuth();
  const [features, setFeatures] = useState<TenantFeature[]>([]);
  const [permissions, setPermissions] = useState<TenantPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenantData = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    
    try {
      // Fetch tenant features
      const { data: featuresData } = await supabase
        .from('tenant_features')
        .select('*');

      // Fetch tenant permissions
      const { data: permissionsData } = await supabase
        .from('tenant_permissions')
        .select('*');

      setFeatures(featuresData || []);
      setPermissions(permissionsData || []);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [user, profile]);

  const hasFeature = (featureName: string): boolean => {
    return features.some(feature => 
      feature.feature_name === featureName && feature.enabled
    );
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!profile?.role) return false;
    
    return permissions.some(permission => 
      permission.role === profile.role && 
      permission.permission_name === permissionName && 
      permission.granted
    );
  };

  const updateFeature = async (featureName: string, enabled: boolean, config?: any) => {
    if (!profile || profile.role !== 'admin') {
      console.error('Only admins can update features');
      return false;
    }

    const { error } = await supabase
      .from('tenant_features')
      .update({ enabled, config: config || {} })
      .eq('feature_name', featureName);

    if (error) {
      console.error('Error updating feature:', error);
      return false;
    }

    await fetchTenantData();
    return true;
  };

  const updatePermission = async (role: UserRole, permissionName: string, granted: boolean) => {
    if (!profile || profile.role !== 'admin') {
      console.error('Only admins can update permissions');
      return false;
    }

    const { error } = await supabase
      .from('tenant_permissions')
      .update({ granted })
      .eq('role', role)
      .eq('permission_name', permissionName);

    if (error) {
      console.error('Error updating permission:', error);
      return false;
    }

    await fetchTenantData();
    return true;
  };

  return {
    features,
    permissions,
    loading,
    hasFeature,
    hasPermission,
    updateFeature,
    updatePermission,
    refreshData: fetchTenantData
  };
};
