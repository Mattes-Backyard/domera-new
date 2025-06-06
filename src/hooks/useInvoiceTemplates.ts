
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';

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

// Helper function to safely parse template data from Supabase Json type
const parseTemplateData = (data: Json): TemplateData => {
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return data as TemplateData;
  }
  
  // Fallback to default structure if parsing fails
  return {
    layout: {
      type: 'single-column',
      spacing: 'normal',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        success: '#10b981',
        background: '#ffffff',
      },
    },
    components: [],
  };
};

// Helper function to convert TemplateData to Json for Supabase
const templateDataToJson = (data: TemplateData): Json => {
  return data as Json;
};

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

      const parsedTemplates = (data || []).map(template => ({
        ...template,
        template_data: parseTemplateData(template.template_data)
      }));

      setTemplates(parsedTemplates);
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
          name: templateData.name,
          description: templateData.description,
          is_default: templateData.is_default,
          template_data: templateDataToJson(templateData.template_data),
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
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Only add fields that are being updated
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.is_default !== undefined) updateData.is_default = updates.is_default;
      if (updates.template_data !== undefined) updateData.template_data = templateDataToJson(updates.template_data);

      const { data, error } = await supabase
        .from('invoice_templates')
        .update(updateData)
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
