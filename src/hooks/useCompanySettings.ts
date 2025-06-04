import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CompanyInfo {
  id: string;
  company_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  vat_number: string;
  logo_url?: string;
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  zip_code?: string;
  country?: string;
  email?: string;
  phone?: string;
  timezone?: string;
  manager_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useCompanySettings = () => {
  const { user } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company info:', error);
        return;
      }

      if (data) {
        setCompanyInfo(data);
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching facilities:', error);
        return;
      }

      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const updateCompanyInfo = async (updates: Partial<CompanyInfo>) => {
    if (!user) return false;

    try {
      // Check if a company record already exists
      const { data: existingCompany, error: fetchError } = await supabase
        .from('company_info')
        .select('id')
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing company:', fetchError);
        toast.error('Failed to check existing company information');
        return false;
      }

      let result;
      
      if (existingCompany) {
        // Update existing company record
        const { data, error } = await supabase
          .from('company_info')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCompany.id)
          .select()
          .single();

        result = { data, error };
      } else {
        // Create new company record (only if none exists)
        const { data, error } = await supabase
          .from('company_info')
          .insert({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        result = { data, error };
      }

      if (result.error) {
        console.error('Error updating company info:', result.error);
        toast.error('Failed to update company information');
        return false;
      }

      setCompanyInfo(result.data);
      toast.success('Company information updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating company info:', error);
      toast.error('Failed to update company information');
      return false;
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload a logo');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      console.log('Uploading file to:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        toast.error(`Failed to upload logo: ${uploadError.message}`);
        return null;
      }

      console.log('Upload successful:', uploadData);

      const { data: urlData } = supabase.storage
        .from('company-assets')
        .getPublicUrl(uploadData.path);

      const logoUrl = urlData.publicUrl;
      console.log('Logo URL:', logoUrl);

      // Update company info with new logo URL
      const updated = await updateCompanyInfo({ logo_url: logoUrl });
      if (updated) {
        toast.success('Logo uploaded successfully');
        return logoUrl;
      }

      return null;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  };

  const createFacility = async (facilityData: Omit<Facility, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('facilities')
        .insert([facilityData])
        .select()
        .single();

      if (error) {
        console.error('Error creating facility:', error);
        toast.error('Failed to create facility');
        return false;
      }

      setFacilities(prev => [...prev, data]);
      toast.success('Facility created successfully');
      return true;
    } catch (error) {
      console.error('Error creating facility:', error);
      toast.error('Failed to create facility');
      return false;
    }
  };

  const updateFacility = async (id: string, updates: Partial<Facility>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('facilities')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating facility:', error);
        toast.error('Failed to update facility');
        return false;
      }

      setFacilities(prev => prev.map(f => f.id === id ? data : f));
      toast.success('Facility updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating facility:', error);
      toast.error('Failed to update facility');
      return false;
    }
  };

  const deleteFacility = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting facility:', error);
        toast.error('Failed to delete facility');
        return false;
      }

      setFacilities(prev => prev.filter(f => f.id !== id));
      toast.success('Facility deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error('Failed to delete facility');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        await Promise.all([fetchCompanyInfo(), fetchFacilities()]);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  return {
    companyInfo,
    facilities,
    loading,
    updateCompanyInfo,
    uploadLogo,
    createFacility,
    updateFacility,
    deleteFacility,
    refreshData: () => {
      fetchCompanyInfo();
      fetchFacilities();
    }
  };
};
