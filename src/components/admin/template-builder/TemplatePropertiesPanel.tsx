
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateComponent, TemplateData } from '@/hooks/useInvoiceTemplates';
import { Settings, Palette, Eye, Info } from 'lucide-react';

interface TemplatePropertiesPanelProps {
  templateName: string;
  templateDescription: string;
  templateData: TemplateData;
  selectedComponentId: string | null;
  onTemplateNameChange: (name: string) => void;
  onTemplateDescriptionChange: (description: string) => void;
  onColorChange: (colorType: string, value: string) => void;
  onComponentConfigChange: (id: string, config: any) => void;
}

export const TemplatePropertiesPanel: React.FC<TemplatePropertiesPanelProps> = ({
  templateName,
  templateDescription,
  templateData,
  selectedComponentId,
  onTemplateNameChange,
  onTemplateDescriptionChange,
  onColorChange,
  onComponentConfigChange
}) => {
  const selectedComponent = templateData.components.find(c => c.id === selectedComponentId);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="template" className="h-full">
          <div className="px-4 pb-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                Template
              </TabsTrigger>
              <TabsTrigger value="design" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Design
              </TabsTrigger>
              <TabsTrigger value="component" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Component
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-[400px] px-4">
            <TabsContent value="template" className="space-y-4 mt-0">
              <div>
                <label className="text-sm font-medium block mb-2">Template Name</label>
                <Input
                  value={templateName}
                  onChange={(e) => onTemplateNameChange(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Description</label>
                <Textarea
                  value={templateDescription}
                  onChange={(e) => onTemplateDescriptionChange(e.target.value)}
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Components ({templateData.components.length})</label>
                <div className="space-y-2">
                  {templateData.components.map((component, index) => (
                    <div key={component.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-white px-2 py-1 rounded">{index + 1}</span>
                        <span className="text-sm capitalize">{component.type.replace('-', ' ')}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {component.position.x.toFixed(0)},{component.position.y.toFixed(0)}
                      </Badge>
                    </div>
                  ))}
                  {templateData.components.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No components added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4 mt-0">
              <div>
                <label className="text-sm font-medium mb-3 block">Color Scheme</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Primary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={templateData.layout.colors.primary}
                        onChange={(e) => onColorChange('primary', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={templateData.layout.colors.primary}
                        onChange={(e) => onColorChange('primary', e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Secondary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={templateData.layout.colors.secondary}
                        onChange={(e) => onColorChange('secondary', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={templateData.layout.colors.secondary}
                        onChange={(e) => onColorChange('secondary', e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Success</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={templateData.layout.colors.success}
                        onChange={(e) => onColorChange('success', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={templateData.layout.colors.success}
                        onChange={(e) => onColorChange('success', e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={templateData.layout.colors.background}
                        onChange={(e) => onColorChange('background', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={templateData.layout.colors.background}
                        onChange={(e) => onColorChange('background', e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Layout Settings</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Type:</span>
                    <Badge variant="outline">{templateData.layout.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Spacing:</span>
                    <Badge variant="outline">{templateData.layout.spacing}</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="component" className="space-y-4 mt-0">
              {selectedComponent ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-medium capitalize">
                      {selectedComponent.type.replace('-', ' ')} Settings
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {selectedComponent.id.split('-')[0]}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium block mb-1">Width (%)</label>
                        <Input
                          type="number"
                          value={selectedComponent.size.width}
                          onChange={(e) => {
                            const width = parseFloat(e.target.value);
                            onComponentConfigChange(selectedComponent.id, {
                              size: { ...selectedComponent.size, width }
                            });
                          }}
                          min="10"
                          max="100"
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Height (%)</label>
                        <Input
                          type="number"
                          value={selectedComponent.size.height}
                          onChange={(e) => {
                            const height = parseFloat(e.target.value);
                            onComponentConfigChange(selectedComponent.id, {
                              size: { ...selectedComponent.size, height }
                            });
                          }}
                          min="5"
                          max="50"
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium block mb-1">X Position (%)</label>
                        <Input
                          type="number"
                          value={selectedComponent.position.x}
                          onChange={(e) => {
                            const x = parseFloat(e.target.value);
                            onComponentConfigChange(selectedComponent.id, {
                              position: { ...selectedComponent.position, x }
                            });
                          }}
                          min="0"
                          max="100"
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Y Position (%)</label>
                        <Input
                          type="number"
                          value={selectedComponent.position.y}
                          onChange={(e) => {
                            const y = parseFloat(e.target.value);
                            onComponentConfigChange(selectedComponent.id, {
                              position: { ...selectedComponent.position, y }
                            });
                          }}
                          min="0"
                          max="100"
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a component to edit its properties</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
