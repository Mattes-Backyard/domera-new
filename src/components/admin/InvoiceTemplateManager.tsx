
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useInvoiceTemplates } from '@/hooks/useInvoiceTemplates';
import { InvoiceTemplateDesigner } from './InvoiceTemplateDesigner';
import { Edit, Trash2, Star, StarOff, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const InvoiceTemplateManager: React.FC = () => {
  const { templates, loading, deleteTemplate, setDefaultTemplate } = useInvoiceTemplates();
  const [activeView, setActiveView] = useState<'list' | 'designer'>('list');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      toast.success('Template deleted successfully');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultTemplate(id);
      toast.success('Default template updated');
    } catch (error) {
      toast.error('Failed to set default template');
    }
  };

  if (loading) {
    return <div className="p-6">Loading templates...</div>;
  }

  if (activeView === 'designer') {
    return (
      <div>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setActiveView('list')}
          >
            ← Back to Templates
          </Button>
        </div>
        <InvoiceTemplateDesigner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Templates</h2>
          <p className="text-muted-foreground">
            Manage your invoice templates and create new designs
          </p>
        </div>
        <Button onClick={() => setActiveView('designer')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {template.name}
                    {template.is_default && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 h-32 relative overflow-hidden">
                  <div className="text-xs text-gray-500 mb-2">Preview</div>
                  <div className="space-y-1">
                    {template.template_data.components.slice(0, 4).map((component, index) => (
                      <div
                        key={component.id}
                        className="h-2 bg-gray-300 rounded"
                        style={{ 
                          width: `${Math.min(component.size.width, 80)}%`,
                          backgroundColor: index === 0 ? template.template_data.layout.colors.primary : '#d1d5db'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{template.template_data.components.length} components</span>
                  <span>{new Date(template.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {!template.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(template.id)}
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {templates.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No templates yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first invoice template to get started
                </p>
                <Button onClick={() => setActiveView('designer')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
