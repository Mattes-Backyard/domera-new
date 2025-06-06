
import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvoiceTemplates, TemplateComponent, TemplateData } from '@/hooks/useInvoiceTemplates';
import { Trash2, Save, Eye, Settings, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

const ItemTypes = {
  COMPONENT: 'component',
  EXISTING_COMPONENT: 'existing_component'
};

interface DraggableComponentProps {
  component: any;
  isNew?: boolean;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isNew = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: isNew ? ItemTypes.COMPONENT : ItemTypes.EXISTING_COMPONENT,
    item: { ...component, isNew },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move bg-white hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium">{component.name}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{component.type}</p>
    </div>
  );
};

interface DroppableCanvasProps {
  components: TemplateComponent[];
  onDrop: (item: any, offset: { x: number; y: number }) => void;
  onComponentUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
  onComponentDelete: (id: string) => void;
  colors: any;
}

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  components,
  onDrop,
  onComponentUpdate,
  onComponentDelete,
  colors
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.COMPONENT, ItemTypes.EXISTING_COMPONENT],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = drop.current?.getBoundingClientRect();
      if (offset && canvasRect) {
        const x = ((offset.x - canvasRect.left) / canvasRect.width) * 100;
        const y = ((offset.y - canvasRect.top) / canvasRect.height) * 100;
        onDrop(item, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`relative w-full h-[600px] border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden ${
        isOver ? 'border-blue-500 bg-blue-50' : ''
      }`}
      style={{ backgroundColor: colors.background }}
    >
      {components.map((component) => (
        <div
          key={component.id}
          className="absolute border border-gray-300 bg-white rounded shadow-sm group hover:border-blue-500"
          style={{
            left: `${component.position.x}%`,
            top: `${component.position.y}%`,
            width: `${component.size.width}%`,
            height: `${component.size.height}%`,
          }}
        >
          <div className="p-2 h-full flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">{component.type}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={() => onComponentDelete(component.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex-1 text-xs text-gray-500">
              {component.type === 'header' && 'Company Logo & Name'}
              {component.type === 'customer' && 'Customer Information'}
              {component.type === 'invoice-details' && 'Invoice Number & Dates'}
              {component.type === 'line-items' && 'Items Table'}
              {component.type === 'totals' && 'Subtotal, VAT, Total'}
              {component.type === 'payment-terms' && 'Payment Instructions'}
              {component.type === 'footer' && 'Company Footer'}
            </div>
          </div>
        </div>
      ))}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">Drag components here to build your invoice template</p>
            <p className="text-sm">Start with a header component</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const InvoiceTemplateDesigner: React.FC = () => {
  const { componentLibrary, createTemplate, updateTemplate, loading } = useInvoiceTemplates();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
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
      // Adding new component
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
  }, []);

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
      
      toast.success('Template saved successfully');
      setTemplateName('');
      setTemplateDescription('');
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

  if (loading) {
    return <div className="p-6">Loading template designer...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Invoice Template Designer</h2>
          <p className="text-muted-foreground">
            Create custom invoice templates with drag-and-drop components
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Component Library Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Component Library</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {componentLibrary.map((component) => (
                      <DraggableComponent
                        key={component.id}
                        component={component}
                        isNew={true}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Designer Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Template Canvas</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={handleSaveTemplate} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DroppableCanvas
                  components={templateData.components}
                  onDrop={handleDrop}
                  onComponentUpdate={handleComponentUpdate}
                  onComponentDelete={handleComponentDelete}
                  colors={templateData.layout.colors}
                />
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="template" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="template">Template</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="template" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Template Name</label>
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter template name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Enter template description"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Components</label>
                      <div className="space-y-2">
                        {templateData.components.map((component) => (
                          <div key={component.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{component.type}</span>
                            <Badge variant="secondary" className="text-xs">
                              {component.position.x.toFixed(0)},{component.position.y.toFixed(0)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="design" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Color Scheme</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-xs">Primary</label>
                          <input
                            type="color"
                            value={templateData.layout.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs">Secondary</label>
                          <input
                            type="color"
                            value={templateData.layout.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs">Success</label>
                          <input
                            type="color"
                            value={templateData.layout.colors.success}
                            onChange={(e) => handleColorChange('success', e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs">Background</label>
                          <input
                            type="color"
                            value={templateData.layout.colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
