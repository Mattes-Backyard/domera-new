
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, Copy } from 'lucide-react';
import { TemplateData } from '@/hooks/useInvoiceTemplates';

interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  isPopular?: boolean;
  templateData: TemplateData;
}

interface TemplateGalleryProps {
  onSelectTemplate: (templateData: TemplateData) => void;
  onStartBlank: () => void;
}

const starterTemplates: StarterTemplate[] = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Clean, professional design perfect for service businesses',
    preview: '📄',
    category: 'Business',
    isPopular: true,
    templateData: {
      layout: {
        type: 'single-column',
        spacing: 'normal',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          success: '#10b981',
          background: '#ffffff',
        },
      },
      components: [
        {
          id: 'header-1',
          type: 'header',
          position: { x: 5, y: 5 },
          size: { width: 90, height: 15 },
          config: {}
        },
        {
          id: 'customer-1',
          type: 'customer',
          position: { x: 5, y: 25 },
          size: { width: 45, height: 20 },
          config: {}
        },
        {
          id: 'invoice-details-1',
          type: 'invoice-details',
          position: { x: 55, y: 25 },
          size: { width: 40, height: 20 },
          config: {}
        },
        {
          id: 'line-items-1',
          type: 'line-items',
          position: { x: 5, y: 50 },
          size: { width: 90, height: 25 },
          config: {}
        },
        {
          id: 'totals-1',
          type: 'totals',
          position: { x: 60, y: 80 },
          size: { width: 35, height: 15 },
          config: {}
        }
      ],
    },
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, minimalist design with maximum readability',
    preview: '📋',
    category: 'Minimal',
    templateData: {
      layout: {
        type: 'single-column',
        spacing: 'wide',
        colors: {
          primary: '#1f2937',
          secondary: '#9ca3af',
          success: '#059669',
          background: '#ffffff',
        },
      },
      components: [
        {
          id: 'header-2',
          type: 'header',
          position: { x: 10, y: 10 },
          size: { width: 80, height: 12 },
          config: {}
        },
        {
          id: 'invoice-details-2',
          type: 'invoice-details',
          position: { x: 10, y: 30 },
          size: { width: 80, height: 15 },
          config: {}
        },
        {
          id: 'customer-2',
          type: 'customer',
          position: { x: 10, y: 50 },
          size: { width: 80, height: 18 },
          config: {}
        },
        {
          id: 'line-items-2',
          type: 'line-items',
          position: { x: 10, y: 75 },
          size: { width: 80, height: 20 },
          config: {}
        }
      ],
    },
  },
  {
    id: 'colorful-creative',
    name: 'Colorful Creative',
    description: 'Vibrant design for creative businesses and freelancers',
    preview: '🎨',
    category: 'Creative',
    templateData: {
      layout: {
        type: 'single-column',
        spacing: 'compact',
        colors: {
          primary: '#7c3aed',
          secondary: '#f59e0b',
          success: '#10b981',
          background: '#fefefe',
        },
      },
      components: [
        {
          id: 'header-3',
          type: 'header',
          position: { x: 5, y: 5 },
          size: { width: 90, height: 20 },
          config: {}
        },
        {
          id: 'customer-3',
          type: 'customer',
          position: { x: 5, y: 30 },
          size: { width: 40, height: 25 },
          config: {}
        },
        {
          id: 'invoice-details-3',
          type: 'invoice-details',
          position: { x: 50, y: 30 },
          size: { width: 45, height: 25 },
          config: {}
        },
        {
          id: 'line-items-3',
          type: 'line-items',
          position: { x: 5, y: 60 },
          size: { width: 90, height: 30 },
          config: {}
        }
      ],
    },
  },
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onStartBlank,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Choose a Starting Point</h2>
        <p className="text-gray-600">
          Select a starter template or begin with a blank canvas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Blank Template Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold mb-2">Start from Scratch</h3>
            <p className="text-sm text-gray-600 mb-4">
              Begin with a blank template and build exactly what you need
            </p>
            <Button onClick={onStartBlank} variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Blank Template
            </Button>
          </CardContent>
        </Card>

        {/* Starter Templates */}
        {starterTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-md transition-shadow cursor-pointer border hover:border-blue-300"
            onClick={() => onSelectTemplate(template.templateData)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.preview}</span>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                {template.isPopular && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {template.description}
              </p>
              <Button className="w-full" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
