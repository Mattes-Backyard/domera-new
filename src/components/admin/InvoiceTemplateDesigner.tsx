
import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInvoiceTemplates, TemplateComponent, TemplateData } from '@/hooks/useInvoiceTemplates';
import { ComponentLibraryPanel } from './template-builder/ComponentLibraryPanel';
import { TemplateCanvas } from './template-builder/TemplateCanvas';
import { TemplatePropertiesPanel } from './template-builder/TemplatePropertiesPanel';
import { Save, Eye, Download, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceTemplateDesignerProps {
  onBack?: () => void;
}

export const InvoiceTemplateDesigner: React.FC<InvoiceTemplateDesignerProps> = ({ onBack }) => {
  const { componentLibrary, createTemplate, loading } = useInvoiceTemplates();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [templateData, setTemplateData] = useState<TemplateData>({
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
    components: [],
  });

  const handleDrop = useCallback((item: any, offset: { x: number; y: number }) => {
    if (item.isNew) {
      const newComponent: TemplateComponent = {
        id: `${item.type}-${Date.now()}`,
        type: item.type,
        position: offset,
        size: { width: 40, height: 10 },
        config: item.component_data,
      };
      
      setTemplateData(prev => ({
        ...prev,
        components: [...prev.components, newComponent],
      }));
      
      // Auto-select the newly added component
      setSelectedComponentId(newComponent.id);
      toast.success(`${item.name} added to template`);
    }
  }, []);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<TemplateComponent>) => {
    setTemplateData(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    }));
  }, []);

  const handleComponentDelete = useCallback((id: string) => {
    setTemplateData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id),
    }));
    
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
    
    toast.success('Component removed');
  }, [selectedComponentId]);

  const handleComponentConfigChange = useCallback((id: string, config: any) => {
    handleComponentUpdate(id, config);
  }, [handleComponentUpdate]);

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (templateData.components.length === 0) {
      toast.error('Please add at least one component to your template');
      return;
    }

    try {
      await createTemplate({
        name: templateName,
        description: templateDescription,
        is_default: false,
        template_data: templateData,
      });
      
      toast.success('Template saved successfully!');
      
      // Reset form
      setTemplateName('');
      setTemplateDescription('');
      setSelectedComponentId(null);
      setTemplateData({
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
        components: [],
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleColorChange = (colorType: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        colors: {
          ...prev.layout.colors,
          [colorType]: value,
        },
      },
    }));
  };

  const handlePreview = () => {
    // TODO: Open preview modal
    toast.info('Preview functionality coming soon!');
  };

  const handleExport = () => {
    // TODO: Export template
    toast.info('Export functionality coming soon!');
  };

  const handleShare = () => {
    // TODO: Share template
    toast.info('Share functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template designer...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice Template Designer</h1>
                <p className="text-gray-600">Create professional invoice templates with drag-and-drop</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleSaveTemplate} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Library */}
          <div className="w-80 border-r bg-white p-4">
            <ComponentLibraryPanel componentLibrary={componentLibrary} />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 m-4 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Design Canvas</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <TemplateCanvas
                  components={templateData.components}
                  onDrop={handleDrop}
                  onComponentUpdate={handleComponentUpdate}
                  onComponentDelete={handleComponentDelete}
                  onComponentSelect={setSelectedComponentId}
                  selectedComponentId={selectedComponentId}
                  colors={templateData.layout.colors}
                  zoom={zoom}
                  onZoomChange={setZoom}
                  showGrid={showGrid}
                  onGridToggle={() => setShowGrid(!showGrid)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="w-80 border-l bg-white p-4">
            <TemplatePropertiesPanel
              templateName={templateName}
              templateDescription={templateDescription}
              templateData={templateData}
              selectedComponentId={selectedComponentId}
              onTemplateNameChange={setTemplateName}
              onTemplateDescriptionChange={setTemplateDescription}
              onColorChange={handleColorChange}
              onComponentConfigChange={handleComponentConfigChange}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
