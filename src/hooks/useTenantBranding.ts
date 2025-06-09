
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TenantBranding {
  id: string;
  tenant_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url?: string;
  favicon_url?: string;
  login_background_url?: string;
  company_name?: string;
  email_from_name?: string;
  email_from_address?: string;
  custom_css?: string;
  hide_lovable_badge: boolean;
}

export const useTenantBranding = () => {
  const { user, profile } = useAuth();
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tenant_branding')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching branding:', error);
      } else {
        setBranding(data);
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, [user, profile]);

  const updateBranding = async (updates: Partial<TenantBranding>) => {
    if (!profile || profile.role !== 'admin') {
      console.error('Only admins can update branding');
      return false;
    }

    const { error } = await supabase
      .from('tenant_branding')
      .upsert(updates)
      .select()
      .single();

    if (error) {
      console.error('Error updating branding:', error);
      return false;
    }

    await fetchBranding();
    return true;
  };

  // Apply branding to document
  useEffect(() => {
    if (branding) {
      const root = document.documentElement;
      
      if (branding.primary_color) {
        root.style.setProperty('--primary', branding.primary_color);
      }
      if (branding.secondary_color) {
        root.style.setProperty('--secondary', branding.secondary_color);
      }
      if (branding.accent_color) {
        root.style.setProperty('--accent', branding.accent_color);
      }
      
      // Update favicon if provided
      if (branding.favicon_url) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = branding.favicon_url;
        }
      }
      
      // Update document title if company name is provided
      if (branding.company_name) {
        document.title = `${branding.company_name} - Storage Management`;
      }
      
      // Apply custom CSS if provided
      if (branding.custom_css) {
        let styleElement = document.getElementById('tenant-custom-css');
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = 'tenant-custom-css';
          document.head.appendChild(styleElement);
        }
        styleElement.textContent = branding.custom_css;
      }
    }
  }, [branding]);

  return {
    branding,
    loading,
    updateBranding,
    refreshBranding: fetchBranding
  };
};
