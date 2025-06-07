
import React from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from '@/components/ui/badge';
import { GripVertical, FileText, User, Hash, Table, Calculator, CreditCard, MapPin } from 'lucide-react';

interface DraggableTemplateComponentProps {
  component: any;
  isNew?: boolean;
}

const getComponentIcon = (type: string) => {
  const iconMap = {
    header: FileText,
    customer: User,
    'invoice-details': Hash,
    'line-items': Table,
    totals: Calculator,
    'payment-terms': CreditCard,
    footer: MapPin,
  };
  return iconMap[type as keyof typeof iconMap] || FileText;
};

const getComponentColor = (type: string) => {
  const colorMap = {
    header: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    customer: 'bg-green-50 border-green-200 hover:bg-green-100',
    'invoice-details': 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    'line-items': 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    totals: 'bg-red-50 border-red-200 hover:bg-red-100',
    'payment-terms': 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    footer: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
  };
  return colorMap[type as keyof typeof colorMap] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
};

export const DraggableTemplateComponent: React.FC<DraggableTemplateComponentProps> = ({ 
  component, 
  isNew = false 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: isNew ? 'COMPONENT' : 'EXISTING_COMPONENT',
    item: { ...component, isNew },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = getComponentIcon(component.type);
  const colorClass = getComponentColor(component.type);

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move transition-all duration-200 ${colorClass} ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="h-4 w-4 text-gray-400" />
        <Icon className="h-4 w-4 text-gray-600" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-900 block truncate">
            {component.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {component.type}
            </Badge>
          </div>
        </div>
      </div>
      {component.component_data?.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
          {component.component_data.description}
        </p>
      )}
    </div>
  );
};
