
import React from 'react';
import { TemplateComponent } from '@/hooks/useInvoiceTemplates';
import { Button } from '@/components/ui/button';
import { Trash2, Settings, Move } from 'lucide-react';

interface CanvasComponentProps {
  component: TemplateComponent;
  onUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  zoom: number;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
  zoom
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const getComponentPreview = (type: string) => {
    switch (type) {
      case 'header':
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-200 rounded"></div>
            <span className="font-bold text-sm">Company Name</span>
          </div>
        );
      case 'customer':
        return (
          <div className="space-y-1">
            <div className="font-medium text-xs">Bill To:</div>
            <div className="text-xs text-gray-600">Customer Name</div>
            <div className="text-xs text-gray-600">Address</div>
          </div>
        );
      case 'invoice-details':
        return (
          <div className="space-y-1">
            <div className="font-bold text-lg text-blue-600">INVOICE</div>
            <div className="text-xs">Invoice #: 001</div>
            <div className="text-xs">Date: {new Date().toLocaleDateString()}</div>
          </div>
        );
      case 'line-items':
        return (
          <div className="space-y-1">
            <div className="bg-gray-100 p-1 text-xs font-medium">Items</div>
            <div className="flex justify-between text-xs">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="border-t border-gray-200 pt-1">
              <div className="flex justify-between text-xs">
                <span>Service</span>
                <span>$100.00</span>
              </div>
            </div>
          </div>
        );
      case 'totals':
        return (
          <div className="space-y-1 bg-gray-50 p-2 rounded">
            <div className="flex justify-between text-xs">
              <span>Subtotal:</span>
              <span>$100.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>VAT:</span>
              <span>$25.00</span>
            </div>
            <div className="flex justify-between font-bold text-xs border-t pt-1">
              <span>Total:</span>
              <span>$125.00</span>
            </div>
          </div>
        );
      case 'payment-terms':
        return (
          <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
            Payment due within 30 days
          </div>
        );
      case 'footer':
        return (
          <div className="text-center text-xs text-gray-500 border-t pt-1">
            Company Footer Information
          </div>
        );
      default:
        return <div className="text-xs text-gray-500">{type}</div>;
    }
  };

  return (
    <div
      className={`absolute border transition-all duration-200 bg-white rounded shadow-sm group cursor-move ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200 z-10' 
          : 'border-gray-300 hover:border-blue-400'
      }`}
      style={{
        left: `${component.position.x}%`,
        top: `${component.position.y}%`,
        width: `${component.size.width}%`,
        height: `${component.size.height}%`,
        minHeight: `${40 * zoom}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Move className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-600 capitalize">
              {component.type.replace('-', ' ')}
            </span>
          </div>
          <div className={`flex gap-1 transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <Button
              size="sm"
              variant="outline"
              className="h-5 w-5 p-0"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open component settings
              }}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-5 w-5 p-0 hover:bg-red-50 hover:border-red-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
            >
              <Trash2 className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {getComponentPreview(component.type)}
        </div>
      </div>
    </div>
  );
};
