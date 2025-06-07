
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentLibraryItem } from '@/hooks/useInvoiceTemplates';
import { DraggableTemplateComponent } from './DraggableTemplateComponent';
import { Search, Package, Star, Clock } from 'lucide-react';

interface ComponentLibraryPanelProps {
  componentLibrary: ComponentLibraryItem[];
}

export const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
  componentLibrary
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredComponents = componentLibrary.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const componentsByCategory = {
    essential: filteredComponents.filter(c => 
      ['header', 'customer', 'invoice-details', 'line-items', 'totals'].includes(c.type)
    ),
    optional: filteredComponents.filter(c => 
      ['payment-terms', 'footer'].includes(c.type)
    ),
    custom: filteredComponents.filter(c => 
      !['header', 'customer', 'invoice-details', 'line-items', 'totals', 'payment-terms', 'footer'].includes(c.type)
    )
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          Component Library
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="essential" className="h-full">
          <div className="px-4 pb-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="essential" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Essential
              </TabsTrigger>
              <TabsTrigger value="optional" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Optional
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs">
                <Package className="h-3 w-3 mr-1" />
                Custom
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-[400px] px-4">
            <TabsContent value="essential" className="space-y-3 mt-0">
              {componentsByCategory.essential.map((component) => (
                <DraggableTemplateComponent
                  key={component.id}
                  component={component}
                  isNew={true}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="optional" className="space-y-3 mt-0">
              {componentsByCategory.optional.map((component) => (
                <DraggableTemplateComponent
                  key={component.id}
                  component={component}
                  isNew={true}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-3 mt-0">
              {componentsByCategory.custom.length > 0 ? (
                componentsByCategory.custom.map((component) => (
                  <DraggableTemplateComponent
                    key={component.id}
                    component={component}
                    isNew={true}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No custom components yet</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
