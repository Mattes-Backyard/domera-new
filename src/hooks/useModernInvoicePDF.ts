
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import jsPDF from 'jspdf';

export interface ModernInvoiceData {
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
  currency: string;
}

export interface ModernCompanyInfo {
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

export const useModernInvoicePDF = () => {
  const { user } = useAuth();

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
      if (imageUrl.includes('supabase')) {
        const urlParts = imageUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'company-assets');
        if (bucketIndex !== -1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          
          const { data: logoData, error } = await supabase.storage
            .from('company-assets')
            .download(filePath);
          
          if (error || !logoData) {
            return null;
          }
          
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(logoData);
          });
        }
      } else {
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

  const generateModernInvoicePDF = async (invoice: ModernInvoiceData, companyInfo: ModernCompanyInfo) => {
    try {
      console.log('Generating modern PDF for invoice:', invoice.invoice_number);
      
      // Get unit information
      let unitNumber = '';
      if (invoice.unit_rental_id) {
        const { data: rentalData } = await supabase
          .from('unit_rentals')
          .select(`*, units (unit_number)`)
          .eq('id', invoice.unit_rental_id)
          .single();
        
        if (rentalData?.units) {
          unitNumber = rentalData.units.unit_number || '';
        }
      }
      
      const pdf = new jsPDF();
      const currency = invoice.currency || companyInfo?.currency || 'EUR';
      const currencySymbol = getCurrencySymbol(currency);
      
      // Modern color palette
      const colors = {
        primary: '#2563eb',     // Modern blue
        secondary: '#64748b',   // Slate gray
        success: '#10b981',     // Emerald
        warning: '#f59e0b',     // Amber
        error: '#ef4444',       // Red
        light: '#f8fafc',       // Very light gray
        dark: '#1e293b',        // Dark slate
        border: '#e2e8f0'       // Light border
      };

      // Status colors
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'paid': return colors.success;
          case 'overdue': return colors.error;
          case 'sent': return colors.primary;
          case 'pending': return colors.warning;
          default: return colors.secondary;
        }
      };

      // Page setup with modern styling
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');

      // Header section with modern card styling
      pdf.setFillColor(248, 250, 252); // Very light background
      pdf.rect(0, 0, 210, 50, 'F');
      
      // Company logo and branding
      const logoUrl = companyInfo?.logo_url || '/lovable-uploads/aa4e4530-c735-48d1-93c8-a9372425fab5.png';
      
      try {
        const logoBase64 = await loadImageAsBase64(logoUrl);
        if (logoBase64) {
          pdf.addImage(logoBase64, 'JPEG', 20, 15, 40, 20);
        }
      } catch (error) {
        console.log('Could not load company logo:', error);
      }

      // Company name with modern typography
      pdf.setTextColor(30, 41, 59); // Dark slate
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(companyInfo?.company_name || 'Sesam Self Storage Operations AB', 70, 25);

      // Invoice title and status
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(37, 99, 235); // Primary blue
      pdf.text('INVOICE', 20, 70);

      // Status badge
      const statusColor = getStatusColor(invoice.status);
      const statusColorRGB = pdf.getDrawColor(); // Store current color
      
      // Convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 100, g: 116, b: 139 };
      };

      const statusRGB = hexToRgb(statusColor);
      pdf.setFillColor(statusRGB.r, statusRGB.g, statusRGB.b);
      pdf.roundedRect(140, 60, 30, 8, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(invoice.status.toUpperCase(), 145, 66);

      // Invoice details card
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240); // Light border
      pdf.setLineWidth(0.5);
      pdf.roundedRect(20, 85, 170, 35, 3, 3, 'FD');

      // Invoice information with modern layout
      pdf.setTextColor(100, 116, 139); // Secondary gray
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Left column
      pdf.text('Invoice Number', 25, 95);
      pdf.text('Issue Date', 25, 102);
      pdf.text('Due Date', 25, 109);
      
      // Right column - values
      pdf.setTextColor(30, 41, 59); // Dark text
      pdf.setFont('helvetica', 'bold');
      pdf.text(invoice.invoice_number, 80, 95);
      pdf.text(invoice.issue_date, 80, 102);
      pdf.text(invoice.due_date, 80, 109);

      // Customer section
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To', 20, 140);

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(20, 145, 170, 25, 3, 3, 'FD');

      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Customer ID: ${invoice.customer_id}`, 25, 155);

      // Items table with modern styling
      const tableY = 185;
      
      // Table header with gradient effect
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(20, tableY, 170, 12, 2, 2, 'F');
      
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', 25, tableY + 8);
      pdf.text('Qty', 130, tableY + 8);
      pdf.text('Amount', 155, tableY + 8);

      // Table content with alternating rows
      const itemY = tableY + 20;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(20, itemY, 170, 15, 'F');
      
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const description = invoice.description || `Storage Unit ${unitNumber || '1-A1-10'} - Monthly Rental`;
      pdf.text(description, 25, itemY + 8);
      pdf.text('1', 135, itemY + 8);
      pdf.text(`${currencySymbol}${invoice.subtotal.toFixed(2)}`, 155, itemY + 8);

      // Totals section with modern card design
      const totalsY = itemY + 30;
      
      // Subtotal, VAT, and Total with clean spacing
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(110, totalsY, 80, 40, 3, 3, 'FD');

      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      pdf.text('Subtotal', 115, totalsY + 10);
      pdf.text('VAT (' + invoice.vat_rate + '%)', 115, totalsY + 18);
      
      pdf.setTextColor(30, 41, 59);
      pdf.text(`${currencySymbol}${invoice.subtotal.toFixed(2)}`, 165, totalsY + 10);
      pdf.text(`${currencySymbol}${invoice.vat_amount.toFixed(2)}`, 165, totalsY + 18);

      // Total amount with emphasis
      pdf.setFillColor(37, 99, 235);
      pdf.roundedRect(110, totalsY + 25, 80, 12, 2, 2, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total', 115, totalsY + 33);
      pdf.text(`${currencySymbol}${invoice.total_amount.toFixed(2)}`, 165, totalsY + 33);

      // Payment information with modern styling
      const paymentY = totalsY + 50;
      
      pdf.setFillColor(236, 254, 255);
      pdf.setDrawColor(34, 211, 238);
      pdf.setLineWidth(1);
      pdf.roundedRect(20, paymentY, 170, 25, 3, 3, 'FD');

      pdf.setTextColor(8, 145, 178);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Terms', 25, paymentY + 8);

      pdf.setTextColor(21, 94, 117);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment due within 30 days. Thank you for your business!', 25, paymentY + 16);

      // Footer with company information
      const footerY = 270;
      
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      const footerText = [
        `${companyInfo?.company_name || 'Sesam Self Storage Operations AB'}`,
        `${companyInfo?.address || 'Storgatan 22A'} | ${companyInfo?.city || 'Malmö'} | ${companyInfo?.email || 'faktura@sesamselfstorage.se'}`
      ];
      
      footerText.forEach((line, index) => {
        const textWidth = pdf.getTextWidth(line);
        const x = (210 - textWidth) / 2; // Center text
        pdf.text(line, x, footerY + (index * 4));
      });

      // Convert to blob and upload
      const pdfOutput = pdf.output('blob');
      const fileName = `invoice-${invoice.invoice_number}.pdf`;
      
      console.log('Uploading modern PDF to storage:', fileName);
      
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

      console.log('Modern PDF uploaded successfully:', uploadData.path);
      return uploadData.path;
    } catch (error) {
      console.error('Error generating modern PDF:', error);
      throw error;
    }
  };

  const previewModernInvoicePDF = async (invoice: ModernInvoiceData, companyInfo: ModernCompanyInfo) => {
    try {
      console.log('Preview requested for modern invoice:', invoice.invoice_number);
      
      let pdfPath = invoice.pdf_file_path;
      
      if (!pdfPath) {
        console.log('PDF does not exist, generating modern version...');
        pdfPath = await generateModernInvoicePDF(invoice, companyInfo);
        if (!pdfPath) {
          throw new Error('Failed to generate modern PDF');
        }
      }

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

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error previewing modern PDF:', error);
      throw error;
    }
  };

  return {
    generateModernInvoicePDF,
    previewModernInvoicePDF,
    getCurrencySymbol
  };
};
