
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TemplateData } from '@/hooks/useInvoiceTemplates';
import { Download, Share2, X } from 'lucide-react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateData: TemplateData;
  templateName: string;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  templateData,
  templateName,
}) => {
  const sampleData = {
    companyName: "Your Company Name",
    companyAddress: "123 Business St, City, State 12345",
    customerName: "John Doe",
    customerAddress: "456 Customer Ave, City, State 67890",
    invoiceNumber: "INV-001",
    invoiceDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      { description: "Web Design Service", quantity: 1, rate: 1500, amount: 1500 },
      { description: "SEO Optimization", quantity: 1, rate: 800, amount: 800 },
      { description: "Content Creation", quantity: 5, rate: 100, amount: 500 },
    ],
    subtotal: 2800,
    tax: 280,
    total: 3080,
  };

  const renderComponent = (component: any) => {
    const style = {
      position: 'absolute' as const,
      left: `${component.position.x}%`,
      top: `${component.position.y}%`,
      width: `${component.size.width}%`,
      height: `${component.size.height}%`,
    };

    switch (component.type) {
      case 'header':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: templateData.layout.colors.primary }}>
                  {sampleData.companyName}
                </h1>
                <p className="text-sm text-gray-600">{sampleData.companyAddress}</p>
              </div>
            </div>
          </div>
        );

      case 'customer':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{sampleData.customerName}</p>
                <p className="text-sm text-gray-600">{sampleData.customerAddress}</p>
              </div>
            </div>
          </div>
        );

      case 'invoice-details':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-4" style={{ color: templateData.layout.colors.primary }}>
                INVOICE
              </h2>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Invoice #:</span> {sampleData.invoiceNumber}</p>
                <p><span className="font-medium">Date:</span> {sampleData.invoiceDate}</p>
                <p><span className="font-medium">Due Date:</span> {sampleData.dueDate}</p>
              </div>
            </div>
          </div>
        );

      case 'line-items':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium text-sm border-b">
                <div className="grid grid-cols-4 gap-4">
                  <div>Description</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Amount</div>
                </div>
              </div>
              <div className="divide-y">
                {sampleData.items.map((item, index) => (
                  <div key={index} className="px-4 py-2 text-sm">
                    <div className="grid grid-cols-4 gap-4">
                      <div>{item.description}</div>
                      <div className="text-center">{item.quantity}</div>
                      <div className="text-right">${item.rate}</div>
                      <div className="text-right font-medium">${item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'totals':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${sampleData.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span>${sampleData.tax}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span style={{ color: templateData.layout.colors.primary }}>${sampleData.total}</span>
              </div>
            </div>
          </div>
        );

      case 'payment-terms':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-1">Payment Terms</h4>
              <p className="text-sm text-blue-800">
                Payment is due within 30 days of invoice date. Late fees may apply.
              </p>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div key={component.id} style={style} className="p-2">
            <div className="border-t pt-4 text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
              <p>Questions? Contact us at support@company.com</p>
            </div>
          </div>
        );

      default:
        return (
          <div key={component.id} style={style} className="p-2 border border-dashed border-gray-300">
            <span className="text-xs text-gray-500">{component.type}</span>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview: {templateName}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div 
            className="relative mx-auto bg-white border shadow-lg"
            style={{
              width: '210mm',
              height: '297mm',
              backgroundColor: templateData.layout.colors.background,
              transform: 'scale(0.6)',
              transformOrigin: 'top center',
            }}
          >
            {templateData.components.map(renderComponent)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
