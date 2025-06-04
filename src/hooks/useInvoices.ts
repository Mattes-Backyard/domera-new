import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  pdf_file_path?: string;
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
}

export interface CreateInvoiceData {
  invoice_number: string;
  customer_id: string;
  unit_rental_id?: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  status: Invoice['status'];
}

export const useInvoices = () => {
  const { user } = useAuth();
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
        status: invoice.status as Invoice['status']
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
        .single();

      if (companyError) {
        console.error('Error fetching company info:', companyError);
        return;
      }

      setCompanyInfo(companyData);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const generateInvoicePDF = async (invoice: Invoice) => {
    // This will generate a PDF and upload it to Supabase storage
    const pdfContent = generatePDFContent(invoice, companyInfo);
    
    try {
      // Convert HTML to PDF (simplified for demo - in production you'd use a proper PDF library)
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const fileName = `invoice-${invoice.invoice_number}.pdf`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        return null;
      }

      // Update invoice record with file path
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ pdf_file_path: uploadData.path })
        .eq('id', invoice.id);

      if (updateError) {
        console.error('Error updating invoice with PDF path:', updateError);
        return null;
      }

      return uploadData.path;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const generatePDFContent = (invoice: Invoice, company: CompanyInfo | null) => {
    // Simplified PDF content generation (in production, use a proper PDF library)
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company-info { text-align: left; }
          .invoice-info { text-align: right; }
          .customer-info { margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .totals { text-align: right; margin-top: 20px; }
          .total-line { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h2>${company?.company_name || 'StorageFlow Solutions'}</h2>
            <p>${company?.address || '123 Business Street'}</p>
            <p>${company?.city || 'Stockholm'}, ${company?.postal_code || '12345'}</p>
            <p>${company?.country || 'Sweden'}</p>
            <p>Phone: ${company?.phone || '+46 8 123 456 78'}</p>
            <p>Email: ${company?.email || 'billing@storageflow.com'}</p>
            <p>VAT: ${company?.vat_number || 'SE123456789001'}</p>
          </div>
          <div class="invoice-info">
            <h1>INVOICE</h1>
            <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
            <p><strong>Issue Date:</strong> ${invoice.issue_date}</p>
            <p><strong>Due Date:</strong> ${invoice.due_date}</p>
            <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
          </div>
        </div>
        
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p>Customer ID: ${invoice.customer_id}</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Period</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Storage Unit Rental</td>
              <td>${invoice.issue_date} - ${invoice.due_date}</td>
              <td>€${invoice.subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="total-line"><strong>Subtotal: €${invoice.subtotal.toFixed(2)}</strong></div>
          <div class="total-line">VAT (${invoice.vat_rate}%): €${invoice.vat_amount.toFixed(2)}</div>
          <div class="total-line"><strong>Total: €${invoice.total_amount.toFixed(2)}</strong></div>
        </div>

        <div style="margin-top: 40px;">
          <p><strong>Payment Terms:</strong> Net 30 days</p>
          <p><strong>Thank you for your business!</strong></p>
        </div>
      </body>
      </html>
    `;
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

  const downloadInvoicePDF = async (invoice: Invoice) => {
    if (!invoice.pdf_file_path) {
      // Generate PDF if it doesn't exist
      const pdfPath = await generateInvoicePDF(invoice);
      if (!pdfPath) return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('invoices')
        .download(invoice.pdf_file_path!);

      if (error) {
        console.error('Error downloading PDF:', error);
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
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
    generateInvoicePDF,
    downloadInvoicePDF,
    refreshInvoices: fetchInvoices
  };
};
