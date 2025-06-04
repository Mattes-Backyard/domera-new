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
  const { user, profile } = useAuth();
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
      
      // Get unit information for the invoice
      let unitNumber = '';
      if (invoice.unit_rental_id) {
        const { data: rentalData } = await supabase
          .from('unit_rentals')
          .select(`
            *,
            units (
              unit_number
            )
          `)
          .eq('id', invoice.unit_rental_id)
          .single();
        
        if (rentalData?.units) {
          unitNumber = rentalData.units.unit_number || '';
        }
      }
      
      const pdf = new jsPDF();
      const currency = invoice.currency || companyInfo?.currency || 'EUR';
      const currencySymbol = getCurrencySymbol(currency);
      
      // Set up colors to match the invoice design
      const darkGreen = '#2d5016'; // Dark green for headings
      const lightGray = '#f5f5f5'; // Light gray for table headers
      const blackText = '#000000'; // Black for main text
      
      // Company information section (left side)
      pdf.setTextColor(blackText);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(companyInfo?.company_name || 'Sesam Self Storage Operations AB', 20, 25);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const companyLines = [
        companyInfo?.address || 'c/o Revisorerna Syd AB,',
        `${companyInfo?.address || 'Storgatan 22A,'}`,
        `${companyInfo?.city || 'Malmö'}`,
        '',
        `${companyInfo?.phone || '042-44 88 000'}`,
        `${companyInfo?.email || 'faktura@sesamselfstorage.se'}`
      ];
      
      companyLines.forEach((line, index) => {
        pdf.text(line, 20, 35 + (index * 5));
      });

      // Add company logo in upper right corner
      let logoAdded = false;
      const logoUrl = companyInfo?.logo_url || '/lovable-uploads/aa4e4530-c735-48d1-93c8-a9372425fab5.png';
      
      try {
        console.log('Loading company logo:', logoUrl);
        const logoBase64 = await loadImageAsBase64(logoUrl);
        
        if (logoBase64) {
          // Position logo in upper right corner
          pdf.addImage(logoBase64, 'JPEG', 140, 15, 50, 25);
          logoAdded = true;
        }
      } catch (error) {
        console.log('Could not load company logo for PDF:', error);
      }

      // Customer information section (left side, below company info)
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CUSTOMER NAME', 20, 90);
      pdf.text('Address', 20, 96);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Customer ID: ${invoice.customer_id}`, 20, 110);

      // Invoice details section (right side)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fakturadatum', 130, 90);
      pdf.text('Fakturanummer', 130, 96);
      pdf.text('Avser period', 130, 102);

      pdf.setFont('helvetica', 'normal');
      pdf.text(invoice.issue_date, 170, 90);
      pdf.text(invoice.invoice_number, 170, 96);
      pdf.text(`${invoice.issue_date}`, 170, 102);
      pdf.text(`${invoice.due_date}`, 170, 108);

      // "Faktura" heading centered
      pdf.setTextColor(blackText);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      const pageWidth = pdf.internal.pageSize.width;
      const textWidth = pdf.getTextWidth('Faktura');
      pdf.text('Faktura', (pageWidth - textWidth) / 2, 140);

      // Table header
      const tableStartY = 160;
      const tableWidth = 170;
      const rowHeight = 8;
      
      // Table header background (light gray)
      pdf.setFillColor(245, 245, 245);
      pdf.rect(20, tableStartY, tableWidth, rowHeight, 'F');
      
      // Table header text
      pdf.setTextColor(blackText);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Benämning', 22, tableStartY + 5);
      pdf.text('Lev ant', 130, tableStartY + 5);
      pdf.text('Summa', 165, tableStartY + 5);
      
      // Table content row - use unit number if available
      const contentY = tableStartY + rowHeight;
      pdf.setFont('helvetica', 'normal');
      const description = invoice.description || `Hyra Förråd ${unitNumber || '1-A1-10'}`;
      pdf.text(description, 22, contentY + 5);
      pdf.text('1', 130, contentY + 5);
      pdf.text(`${invoice.subtotal.toFixed(2).replace('.', ',')} ${currencySymbol === '€' ? 'kr' : currencySymbol}`, 165, contentY + 5);
      
      // Insurance row if needed
      if (invoice.vat_amount > 0) {
        const insuranceY = contentY + rowHeight;
        pdf.text('Försäkringsvärde upp till: kr 50000,00', 22, insuranceY + 5);
        pdf.text('1', 130, insuranceY + 5);
        pdf.text(`${invoice.vat_amount.toFixed(2).replace('.', ',')} kr`, 165, insuranceY + 5);
      }

      // Table borders
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(20, tableStartY, tableWidth, rowHeight * 3);
      pdf.line(20, tableStartY + rowHeight, 190, tableStartY + rowHeight);
      pdf.line(20, tableStartY + rowHeight * 2, 190, tableStartY + rowHeight * 2);
      
      // Vertical lines
      pdf.line(125, tableStartY, 125, tableStartY + rowHeight * 3);
      pdf.line(160, tableStartY, 160, tableStartY + rowHeight * 3);

      // Totals section (right side)
      const totalsStartY = tableStartY + 50;
      
      // Totals box
      pdf.setFillColor(245, 245, 245);
      pdf.rect(130, totalsStartY, 60, 30, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(130, totalsStartY, 60, 30);
      
      pdf.setTextColor(blackText);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      
      // Totals text
      pdf.text('Exkl. moms', 132, totalsStartY + 8);
      pdf.text(`${invoice.subtotal.toFixed(2).replace('.', ',')} kr`, 165, totalsStartY + 8);
      
      pdf.text('Moms', 132, totalsStartY + 16);
      pdf.text(`${invoice.vat_amount.toFixed(2).replace('.', ',')} kr`, 165, totalsStartY + 16);
      
      pdf.text('ATT BETALA', 132, totalsStartY + 24);
      pdf.text(`${invoice.total_amount.toFixed(2).replace('.', ',')} kr`, 165, totalsStartY + 24);

      // Payment terms at bottom
      const footerY = 240;
      
      pdf.setTextColor(blackText);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Betalningsvillkor, företag: 30 dagar', 20, footerY);
      pdf.text('Betalningsvillkor, privatpersoner: betalning sker genom korttransaktion den 1 i aktuell månad', 20, footerY + 5);
      pdf.text('Enligt ML 3 kap §2 utgår ingen moms för privatpersoner, medan företag betalar 25 % moms.', 20, footerY + 10);

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
    getCurrencySymbol
  };
};
