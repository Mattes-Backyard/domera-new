import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useModernInvoicePDF } from './useModernInvoicePDF';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  unit_rental_id?: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
  description?: string;
  pdf_file_path?: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

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
  currency?: string;
}

export interface CreateInvoiceData {
  invoice_number: string;
  customer_id: string;
  unit_rental_id: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  status: Invoice['status'];
  description?: string;
  currency: string;
}

export const useInvoices = () => {
  const { user, profile } = useAuth();
  const { generateModernInvoicePDF, previewModernInvoicePDF, getCurrencySymbol: getModernCurrencySymbol } = useModernInvoicePDF();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
        return;
      }

      // Type assertion to ensure status field matches our union type
      const typedInvoices = (invoicesData || []).map(invoice => ({
        ...invoice,
        status: invoice.status as Invoice['status'],
        currency: invoice.currency || 'EUR'
      }));

      setInvoices(typedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

      if (companyError && companyError.code !== 'PGRST116') {
        console.error('Error fetching company info:', companyError);
        return;
      }

      setCompanyInfo(companyData);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      SEK: 'kr'
    };
    return symbols[currency] || currency;
  };

  const loadImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
      // Check if it's a Supabase storage URL or external URL
      if (imageUrl.includes('supabase')) {
        // Extract the path from the full URL
        const urlParts = imageUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'company-assets');
        if (bucketIndex !== -1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          
          const { data: logoData, error } = await supabase.storage
            .from('company-assets')
            .download(filePath);
          
          if (error || !logoData) {
            console.log('Could not download logo from Supabase storage:', error);
            return null;
          }
          
          // Convert blob to base64
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(logoData);
          });
        }
      } else {
        // Handle external URLs or local images
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = () => resolve(null);
          img.src = imageUrl;
        });
      }
    } catch (error) {
      console.log('Error loading image:', error);
      return null;
    }
    return null;
  };

  const generateInvoicePDF = async (invoice: Invoice) => {
    try {
      console.log('Generating modern invoice PDF for:', invoice.invoice_number);
      
      if (!companyInfo) {
        throw new Error('Company information not available');
      }

      const modernInvoiceData = {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        customer_id: invoice.customer_id,
        unit_rental_id: invoice.unit_rental_id,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: invoice.subtotal,
        vat_rate: invoice.vat_rate,
        vat_amount: invoice.vat_amount,
        total_amount: invoice.total_amount,
        status: invoice.status,
        description: invoice.description,
        currency: invoice.currency
      };

      const modernCompanyInfo = {
        company_name: companyInfo.company_name,
        address: companyInfo.address,
        city: companyInfo.city,
        postal_code: companyInfo.postal_code,
        country: companyInfo.country,
        phone: companyInfo.phone,
        email: companyInfo.email,
        vat_number: companyInfo.vat_number,
        logo_url: companyInfo.logo_url,
        currency: companyInfo.currency
      };

      const pdfPath = await generateModernInvoicePDF(modernInvoiceData, modernCompanyInfo);

      // Update invoice record with file path
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ pdf_file_path: pdfPath })
        .eq('id', invoice.id);

      if (updateError) {
        console.error('Error updating invoice with PDF path:', updateError);
        throw new Error(`Failed to update invoice: ${updateError.message}`);
      }

      console.log('Invoice updated with modern PDF path');
      await fetchInvoices();
      
      return pdfPath;
    } catch (error) {
      console.error('Error generating modern PDF:', error);
      throw error;
    }
  };

  const previewInvoicePDF = async (invoice: Invoice) => {
    try {
      console.log('Preview requested for modern invoice:', invoice.invoice_number);
      
      if (!companyInfo) {
        throw new Error('Company information not available');
      }

      const modernInvoiceData = {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        customer_id: invoice.customer_id,
        unit_rental_id: invoice.unit_rental_id,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: invoice.subtotal,
        vat_rate: invoice.vat_rate,
        vat_amount: invoice.vat_amount,
        total_amount: invoice.total_amount,
        status: invoice.status,
        description: invoice.description,
        currency: invoice.currency,
        pdf_file_path: invoice.pdf_file_path
      };

      const modernCompanyInfo = {
        company_name: companyInfo.company_name,
        address: companyInfo.address,
        city: companyInfo.city,
        postal_code: companyInfo.postal_code,
        country: companyInfo.country,
        phone: companyInfo.phone,
        email: companyInfo.email,
        vat_number: companyInfo.vat_number,
        logo_url: companyInfo.logo_url,
        currency: companyInfo.currency
      };

      await previewModernInvoicePDF(modernInvoiceData, modernCompanyInfo);
    } catch (error) {
      console.error('Error previewing modern PDF:', error);
      throw error;
    }
  };

  const downloadInvoicePDF = async (invoice: Invoice) => {
    try {
      console.log('Download requested for invoice:', invoice.invoice_number);
      
      let pdfPath = invoice.pdf_file_path;
      
      // Generate PDF if it doesn't exist
      if (!pdfPath) {
        console.log('PDF does not exist, generating...');
        pdfPath = await generateInvoicePDF(invoice);
        if (!pdfPath) {
          throw new Error('Failed to generate PDF');
        }
      }

      console.log('Downloading PDF from path:', pdfPath);

      const { data, error } = await supabase.storage
        .from('company-assets')
        .download(pdfPath);

      if (error) {
        console.error('Error downloading PDF:', error);
        throw new Error(`Failed to download PDF: ${error.message}`);
      }

      if (!data) {
        throw new Error('No PDF data received');
      }

      console.log('PDF downloaded successfully, initiating download');

      // Create download link
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

  const createInvoice = async (invoiceData: CreateInvoiceData) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) {
        console.error('Error creating invoice:', error);
        return null;
      }

      await fetchInvoices(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', invoiceId);

      if (error) {
        console.error('Error updating invoice status:', error);
        return false;
      }

      await fetchInvoices(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return false;
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      // First, get the invoice to check if it has a PDF file
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('pdf_file_path')
        .eq('id', invoiceId)
        .single();

      if (fetchError) {
        console.error('Error fetching invoice for deletion:', fetchError);
        throw new Error(`Failed to fetch invoice: ${fetchError.message}`);
      }

      // Delete the PDF file from storage if it exists
      if (invoice?.pdf_file_path) {
        const { error: storageError } = await supabase.storage
          .from('company-assets')
          .remove([invoice.pdf_file_path]);

        if (storageError) {
          console.warn('Warning: Could not delete PDF file from storage:', storageError);
          // Continue with invoice deletion even if PDF deletion fails
        }
      }

      // Delete the invoice from the database
      const { error: deleteError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (deleteError) {
        console.error('Error deleting invoice:', deleteError);
        throw new Error(`Failed to delete invoice: ${deleteError.message}`);
      }

      await fetchInvoices(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvoices();
      fetchCompanyInfo();
    }
  }, [user]);

  return {
    invoices,
    companyInfo,
    loading,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    generateInvoicePDF,
    previewInvoicePDF,
    downloadInvoicePDF,
    refreshInvoices: fetchInvoices,
    getCurrencySymbol: getModernCurrencySymbol
  };
};
