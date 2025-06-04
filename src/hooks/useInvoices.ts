import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import jsPDF from 'jspdf';

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
  description?: string;
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
    try {
      const pdf = new jsPDF();
      
      // Company logo and header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(companyInfo?.company_name || 'StorageFlow Solutions', 20, 30);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(companyInfo?.address || '123 Business Street', 20, 40);
      pdf.text(`${companyInfo?.city || 'Stockholm'}, ${companyInfo?.postal_code || '12345'}`, 20, 45);
      pdf.text(companyInfo?.country || 'Sweden', 20, 50);
      pdf.text(`Phone: ${companyInfo?.phone || '+46 8 123 456 78'}`, 20, 55);
      pdf.text(`Email: ${companyInfo?.email || 'billing@storageflow.com'}`, 20, 60);
      pdf.text(`VAT: ${companyInfo?.vat_number || 'SE123456789001'}`, 20, 65);

      // Invoice details (right side)
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', 150, 30);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice #: ${invoice.invoice_number}`, 150, 40);
      pdf.text(`Issue Date: ${invoice.issue_date}`, 150, 45);
      pdf.text(`Due Date: ${invoice.due_date}`, 150, 50);
      pdf.text(`Status: ${invoice.status.toUpperCase()}`, 150, 55);

      // Customer information
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, 80);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Customer ID: ${invoice.customer_id}`, 20, 90);

      // Items table
      const tableStartY = 110;
      
      // Table headers
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', 20, tableStartY);
      pdf.text('Period', 80, tableStartY);
      pdf.text('Amount', 150, tableStartY);
      
      // Table line
      pdf.line(20, tableStartY + 2, 190, tableStartY + 2);
      
      // Table content - Use the description from the invoice
      pdf.setFont('helvetica', 'normal');
      const description = invoice.description || 'Storage Unit Rental';
      pdf.text(description, 20, tableStartY + 10);
      pdf.text(`${invoice.issue_date} - ${invoice.due_date}`, 80, tableStartY + 10);
      pdf.text(`€${invoice.subtotal.toFixed(2)}`, 150, tableStartY + 10);
      
      // Table bottom line
      pdf.line(20, tableStartY + 15, 190, tableStartY + 15);

      // Totals
      const totalsY = tableStartY + 30;
      pdf.text(`Subtotal: €${invoice.subtotal.toFixed(2)}`, 130, totalsY);
      pdf.text(`VAT (${invoice.vat_rate}%): €${invoice.vat_amount.toFixed(2)}`, 130, totalsY + 8);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: €${invoice.total_amount.toFixed(2)}`, 130, totalsY + 16);

      // Payment terms
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment Terms: Net 30 days', 20, totalsY + 35);
      pdf.text('Thank you for your business!', 20, totalsY + 45);

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      const fileName = `invoice-${invoice.invoice_number}.pdf`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(fileName, pdfBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'application/pdf'
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

  const previewInvoicePDF = async (invoice: Invoice) => {
    try {
      let pdfPath = invoice.pdf_file_path;
      
      // Generate PDF if it doesn't exist
      if (!pdfPath) {
        pdfPath = await generateInvoicePDF(invoice);
        if (!pdfPath) return;
      }

      // Get the PDF from storage
      const { data, error } = await supabase.storage
        .from('invoices')
        .download(pdfPath);

      if (error) {
        console.error('Error downloading PDF for preview:', error);
        return;
      }

      // Create blob URL and open in new tab
      const url = URL.createObjectURL(data);
      window.open(url, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error previewing PDF:', error);
    }
  };

  const downloadInvoicePDF = async (invoice: Invoice) => {
    try {
      let pdfPath = invoice.pdf_file_path;
      
      // Generate PDF if it doesn't exist
      if (!pdfPath) {
        pdfPath = await generateInvoicePDF(invoice);
        if (!pdfPath) return;
      }

      const { data, error } = await supabase.storage
        .from('invoices')
        .download(pdfPath);

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
    previewInvoicePDF,
    downloadInvoicePDF,
    refreshInvoices: fetchInvoices
  };
};
