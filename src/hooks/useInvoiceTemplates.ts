
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  template_data: TemplateData;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateData {
  layout: {
    type: string;
    spacing: string;
    colors: {
      primary: string;
      secondary: string;
      success: string;
      background: string;
    };
  };
  components: TemplateComponent[];
}

export interface TemplateComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: any;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  type: string;
  component_data: any;
  created_at: string;
}

export const useInvoiceTemplates = () => {
  const { user, profile } = useAuth();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [componentLibrary, setComponentLibrary] = useState<ComponentLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        return;
      }

      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchComponentLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('template_components')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching component library:', error);
        return;
      }

      setComponentLibrary(data || []);
    } catch (error) {
      console.error('Error fetching component library:', error);
    }
  };

  const createTemplate = async (templateData: Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .insert([{
          ...templateData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        throw error;
      }

      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<InvoiceTemplate>) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating template:', error);
        throw error;
      }

      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      const { error } = await supabase
        .from('invoice_templates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting template:', error);
        throw error;
      }

      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  const setDefaultTemplate = async (id: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      // First, unset all default templates
      await supabase
        .from('invoice_templates')
        .update({ is_default: false });

      // Then set the selected template as default
      const { error } = await supabase
        .from('invoice_templates')
        .update({ is_default: true })
        .eq('id', id);

      if (error) {
        console.error('Error setting default template:', error);
        throw error;
      }

      await fetchTemplates();
    } catch (error) {
      console.error('Error setting default template:', error);
      throw error;
    }
  };

  const getDefaultTemplate = () => {
    return templates.find(template => template.is_default);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTemplates(),
        fetchComponentLibrary()
      ]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    templates,
    componentLibrary,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    getDefaultTemplate,
    refreshTemplates: fetchTemplates
  };
};
