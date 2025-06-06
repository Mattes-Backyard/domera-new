
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useInvoiceTemplates } from './useInvoiceTemplates';
import jsPDF from 'jspdf';

export interface TemplateInvoiceData {
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

export interface TemplateCompanyInfo {
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

export const useTemplateBasedInvoicePDF = () => {
  const { user } = useAuth();
  const { getDefaultTemplate } = useInvoiceTemplates();

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

  const renderTemplateComponent = async (
    pdf: jsPDF,
    component: any,
    invoiceData: TemplateInvoiceData,
    companyInfo: TemplateCompanyInfo,
    colors: any
  ) => {
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    const x = (component.position.x / 100) * pageWidth;
    const y = (component.position.y / 100) * pageHeight;
    const width = (component.size.width / 100) * pageWidth;
    const height = (component.size.height / 100) * pageHeight;

    // Convert hex colors to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    switch (component.type) {
      case 'header':
        // Company header with logo and name
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(companyInfo.company_name || 'Company Name', x, y + 10);
        
        if (companyInfo.logo_url) {
          try {
            const logoBase64 = await loadImageAsBase64(companyInfo.logo_url);
            if (logoBase64) {
              pdf.addImage(logoBase64, 'JPEG', x, y, 30, 15);
              pdf.text(companyInfo.company_name || 'Company Name', x + 35, y + 10);
            }
          } catch (error) {
            console.log('Could not load company logo:', error);
          }
        }
        break;

      case 'customer':
        // Customer information
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bill To:', x, y + 5);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`Customer ID: ${invoiceData.customer_id}`, x, y + 12);
        break;

      case 'invoice-details':
        // Invoice details
        const primaryRgb = hexToRgb(colors.primary);
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('INVOICE', x, y + 8);
        
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Invoice #: ${invoiceData.invoice_number}`, x, y + 18);
        pdf.text(`Issue Date: ${invoiceData.issue_date}`, x, y + 25);
        pdf.text(`Due Date: ${invoiceData.due_date}`, x, y + 32);
        break;

      case 'line-items':
        // Line items table
        const tableY = y + 5;
        
        // Table header
        pdf.setFillColor(248, 250, 252);
        pdf.rect(x, tableY, width, 8, 'F');
        
        pdf.setTextColor(71, 85, 105);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Description', x + 2, tableY + 5);
        pdf.text('Qty', x + width - 40, tableY + 5);
        pdf.text('Amount', x + width - 20, tableY + 5);
        
        // Table content
        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'normal');
        const description = invoiceData.description || 'Storage Unit Rental - Monthly';
        pdf.text(description, x + 2, tableY + 15);
        pdf.text('1', x + width - 40, tableY + 15);
        pdf.text(`${getCurrencySymbol(invoiceData.currency)}${invoiceData.subtotal.toFixed(2)}`, x + width - 20, tableY + 15);
        break;

      case 'totals':
        // Totals section
        const currency = getCurrencySymbol(invoiceData.currency);
        
        pdf.setFillColor(248, 250, 252);
        pdf.rect(x, y, width, height, 'F');
        
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        pdf.text('Subtotal:', x + 5, y + 8);
        pdf.text(`VAT (${invoiceData.vat_rate}%):`, x + 5, y + 15);
        
        pdf.setTextColor(30, 41, 59);
        pdf.text(`${currency}${invoiceData.subtotal.toFixed(2)}`, x + width - 20, y + 8);
        pdf.text(`${currency}${invoiceData.vat_amount.toFixed(2)}`, x + width - 20, y + 15);
        
        // Total with emphasis
        const totalRgb = hexToRgb(colors.primary);
        pdf.setFillColor(totalRgb.r, totalRgb.g, totalRgb.b);
        pdf.rect(x, y + 20, width, 10, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Total:', x + 5, y + 27);
        pdf.text(`${currency}${invoiceData.total_amount.toFixed(2)}`, x + width - 20, y + 27);
        break;

      case 'payment-terms':
        // Payment terms
        pdf.setFillColor(236, 254, 255);
        pdf.rect(x, y, width, height, 'F');
        
        pdf.setTextColor(21, 94, 117);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Payment due within 30 days. Thank you for your business!', x + 5, y + height/2);
        break;

      case 'footer':
        // Footer
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        
        const footerText = `${companyInfo.company_name} | ${companyInfo.address} | ${companyInfo.email}`;
        const textWidth = pdf.getTextWidth(footerText);
        const centerX = x + (width - textWidth) / 2;
        pdf.text(footerText, centerX, y + height/2);
        break;
    }
  };

  const generateTemplateBasedInvoicePDF = async (
    invoiceData: TemplateInvoiceData,
    companyInfo: TemplateCompanyInfo,
    templateId?: string
  ) => {
    try {
      console.log('Generating template-based PDF for invoice:', invoiceData.invoice_number);
      
      const template = getDefaultTemplate();
      if (!template) {
        throw new Error('No default template found');
      }

      const pdf = new jsPDF();
      const colors = template.template_data.layout.colors;
      
      // Set background color
      const bgRgb = (() => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colors.background);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
      })();
      
      pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
      pdf.rect(0, 0, 210, 297, 'F');

      // Render all components based on template
      for (const component of template.template_data.components) {
        await renderTemplateComponent(pdf, component, invoiceData, companyInfo, colors);
      }

      // Convert to blob and upload
      const pdfOutput = pdf.output('blob');
      const fileName = `invoice-${invoiceData.invoice_number}.pdf`;
      
      console.log('Uploading template-based PDF to storage:', fileName);
      
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

      console.log('Template-based PDF uploaded successfully:', uploadData.path);
      return uploadData.path;
    } catch (error) {
      console.error('Error generating template-based PDF:', error);
      throw error;
    }
  };

  return {
    generateTemplateBasedInvoicePDF,
    getCurrencySymbol
  };
};
