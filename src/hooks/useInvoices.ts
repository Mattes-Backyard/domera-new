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
      console.log('Starting PDF generation for invoice:', invoice.invoice_number);
      
      const pdf = new jsPDF();
      const currency = invoice.currency || companyInfo?.currency || 'EUR';
      const currencySymbol = getCurrencySymbol(currency);
      
      // Set up colors
      const primaryColor = '#1e40af'; // Blue
      const secondaryColor = '#64748b'; // Gray
      const textColor = '#1f2937'; // Dark gray
      
      // Add company logo
      let logoAdded = false;
      const logoUrl = companyInfo?.logo_url || '/lovable-uploads/aa4e4530-c735-48d1-93c8-a9372425fab5.png';
      
      try {
        console.log('Loading company logo:', logoUrl);
        const logoBase64 = await loadImageAsBase64(logoUrl);
        
        if (logoBase64) {
          pdf.addImage(logoBase64, 'JPEG', 20, 15, 30, 30);
          logoAdded = true;
        }
      } catch (error) {
        console.log('Could not load company logo for PDF:', error);
      }
      
      // Header background
      pdf.setFillColor(248, 250, 252); // Light gray background
      pdf.rect(0, 0, 210, 60, 'F');
      
      // Company information section
      const companyStartX = logoAdded ? 55 : 20;
      pdf.setTextColor(textColor);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text(companyInfo?.company_name || 'StorageFlow Solutions', companyStartX, 25);
      
      // Company details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(secondaryColor);
      
      const companyLines = [
        companyInfo?.address || 'Alögatan 5',
        `${companyInfo?.postal_code || '25730'} ${companyInfo?.city || 'Rydebäck'}`,
        companyInfo?.country || 'Sweden',
        `Phone: ${companyInfo?.phone || '+46730824768'}`,
        `Email: ${companyInfo?.email || 'invoice@company.com'}`,
        `VAT: ${companyInfo?.vat_number || 'SE32321321'}`
      ];
      
      companyLines.forEach((line, index) => {
        pdf.text(line, companyStartX, 32 + (index * 4));
      });

      // Invoice title and details (right side)
      pdf.setTextColor(primaryColor);
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', 140, 30);
      
      // Invoice details box
      pdf.setDrawColor(primaryColor);
      pdf.setLineWidth(0.5);
      pdf.rect(140, 35, 50, 25);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textColor);
      
      const invoiceDetails = [
        `Invoice #: ${invoice.invoice_number}`,
        `Issue Date: ${invoice.issue_date}`,
        `Due Date: ${invoice.due_date}`,
        `Currency: ${currency}`
      ];
      
      invoiceDetails.forEach((detail, index) => {
        pdf.text(detail, 142, 40 + (index * 4));
      });

      // Status badge
      const statusColors: Record<string, string> = {
        draft: '#6b7280',
        sent: '#3b82f6',
        paid: '#10b981',
        overdue: '#ef4444',
        cancelled: '#6b7280',
        pending: '#f59e0b'
      };
      
      pdf.setFillColor(statusColors[invoice.status] || '#6b7280');
      pdf.roundedRect(140, 62, 30, 8, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(invoice.status.toUpperCase(), 142, 67);

      // Bill To section
      pdf.setTextColor(primaryColor);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO:', 20, 85);
      
      pdf.setTextColor(textColor);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Customer ID: ${invoice.customer_id}`, 20, 92);

      // Items table
      const tableStartY = 110;
      const tableWidth = 170;
      const rowHeight = 8;
      
      // Table header
      pdf.setFillColor(primaryColor);
      pdf.rect(20, tableStartY, tableWidth, rowHeight, 'F');
      
      pdf.setTextColor(255, 255, 252);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DESCRIPTION', 22, tableStartY + 5);
      pdf.text('PERIOD', 100, tableStartY + 5);
      pdf.text('AMOUNT', 160, tableStartY + 5);
      
      // Table content
      const contentY = tableStartY + rowHeight;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(20, contentY, tableWidth, rowHeight, 'F');
      
      pdf.setTextColor(textColor);
      pdf.setFont('helvetica', 'normal');
      const description = invoice.description || 'Storage Unit Rental';
      pdf.text(description, 22, contentY + 5);
      pdf.text(`${invoice.issue_date} - ${invoice.due_date}`, 100, contentY + 5);
      pdf.text(`${currencySymbol}${invoice.subtotal.toFixed(2)}`, 160, contentY + 5);
      
      // Table border
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.rect(20, tableStartY, tableWidth, rowHeight * 2);

      // Totals section
      const totalsStartY = contentY + 25;
      const totalsX = 130;
      
      // Totals background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(totalsX, totalsStartY, 60, 25, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(totalsX, totalsStartY, 60, 25);
      
      pdf.setTextColor(textColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Subtotal
      pdf.text('Subtotal:', totalsX + 2, totalsStartY + 6);
      pdf.text(`${currencySymbol}${invoice.subtotal.toFixed(2)}`, totalsX + 35, totalsStartY + 6);
      
      // VAT
      pdf.text(`VAT (${invoice.vat_rate}%):`, totalsX + 2, totalsStartY + 12);
      pdf.text(`${currencySymbol}${invoice.vat_amount.toFixed(2)}`, totalsX + 35, totalsStartY + 12);
      
      // Total
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('TOTAL:', totalsX + 2, totalsStartY + 20);
      pdf.text(`${currencySymbol}${invoice.total_amount.toFixed(2)}`, totalsX + 35, totalsStartY + 20);

      // Footer section
      const footerY = 240;
      
      // Payment terms
      pdf.setTextColor(textColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAYMENT TERMS:', 20, footerY);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Net 30 days', 20, footerY + 6);
      
      // Thank you message
      pdf.setTextColor(primaryColor);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Thank you for your business!', 20, footerY + 20);
      
      // Footer line
      pdf.setDrawColor(primaryColor);
      pdf.setLineWidth(1);
      pdf.line(20, footerY + 25, 190, footerY + 25);

      // Convert PDF to blob with correct content type
      const pdfOutput = pdf.output('blob');
      const fileName = `invoice-${invoice.invoice_number}.pdf`;
      
      console.log('Uploading PDF to storage:', fileName);
      
      // Upload to Supabase storage with proper PDF content type
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(`invoices/${fileName}`, pdfOutput, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'application/pdf'
        });

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        throw new Error(`Failed to upload PDF: ${uploadError.message}`);
      }

      console.log('PDF uploaded successfully:', uploadData.path);

      // Update invoice record with file path
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ pdf_file_path: uploadData.path })
        .eq('id', invoice.id);

      if (updateError) {
        console.error('Error updating invoice with PDF path:', updateError);
        throw new Error(`Failed to update invoice: ${updateError.message}`);
      }

      console.log('Invoice updated with PDF path');
      await fetchInvoices(); // Refresh the invoices list
      
      return uploadData.path;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const previewInvoicePDF = async (invoice: Invoice) => {
    try {
      console.log('Preview requested for invoice:', invoice.invoice_number);
      
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

      // Get the PDF from storage
      const { data, error } = await supabase.storage
        .from('company-assets')
        .download(pdfPath);

      if (error) {
        console.error('Error downloading PDF for preview:', error);
        throw new Error(`Failed to download PDF: ${error.message}`);
      }

      if (!data) {
        throw new Error('No PDF data received');
      }

      console.log('PDF downloaded successfully, opening preview');

      // Create blob URL and open in new tab
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        // Fallback: create download if popup blocked
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error previewing PDF:', error);
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
    refreshInvoices: fetchInvoices,
    getCurrencySymbol
  };
};
