
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useInvoiceTemplates } from '@/hooks/useInvoiceTemplates';
import { InvoiceTemplateDesigner } from './InvoiceTemplateDesigner';
import { Edit, Trash2, Star, StarOff, Plus, Eye, Copy, Download, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const InvoiceTemplateManager: React.FC = () => {
  const { templates, loading, deleteTemplate, setDefaultTemplate } = useInvoiceTemplates();
  const [activeView, setActiveView] = useState<'list' | 'designer'>('list');

  const handleDeleteTemplate = async (id: string, name: string) => {
    try {
      await deleteTemplate(id);
      toast.success(`Template "${name}" deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleSetDefault = async (id: string, name: string) => {
    try {
      await setDefaultTemplate(id);
      toast.success(`"${name}" is now the default template`);
    } catch (error) {
      toast.error('Failed to set default template');
    }
  };

  const handleDuplicateTemplate = (template: any) => {
    // TODO: Implement template duplication
    toast.info('Template duplication coming soon!');
  };

  const handleExportTemplate = (template: any) => {
    // TODO: Implement template export
    toast.info('Template export coming soon!');
  };

  const handlePreviewTemplate = (template: any) => {
    // TODO: Implement template preview
    toast.info('Template preview coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (activeView === 'designer') {
    return (
      <InvoiceTemplateDesigner onBack={() => setActiveView('list')} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Invoice Templates</h2>
          <p className="text-gray-600 mt-1">
            Create and manage professional invoice templates for your business
          </p>
        </div>
        <Button 
          onClick={() => setActiveView('designer')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first invoice template to get started with professional invoicing
              </p>
              <Button 
                onClick={() => setActiveView('designer')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg flex items-center gap-2 mb-1">
                      <span className="truncate">{template.name}</span>
                      {template.is_default && (
                        <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    {template.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreviewTemplate(template)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportTemplate(template)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!template.is_default && (
                        <DropdownMenuItem onClick={() => handleSetDefault(template.id, template.name)}>
                          <Star className="h-4 w-4 mr-2" />
                          Set as Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTemplate(template.id, template.name)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Template Preview */}
                <div 
                  className="bg-gray-50 rounded-lg p-4 h-40 relative overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handlePreviewTemplate(template)}
                >
                  <div className="text-xs text-gray-500 mb-3 font-medium">Template Preview</div>
                  <div className="space-y-2">
                    {template.template_data.components.slice(0, 6).map((component, index) => (
                      <div
                        key={component.id}
                        className="h-2 rounded transition-all duration-200"
                        style={{ 
                          width: `${Math.min(component.size.width * 0.8, 90)}%`,
                          backgroundColor: index === 0 
                            ? template.template_data.layout.colors.primary
                            : index === 1
                            ? template.template_data.layout.colors.secondary
                            : '#e5e7eb',
                          opacity: 1 - (index * 0.1)
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Color palette indicator */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {Object.values(template.template_data.layout.colors).slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-white"
                        style={{ backgroundColor: color as string }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Template Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <span>{template.template_data.components.length} components</span>
                    <span>•</span>
                    <span>{new Date(template.created_at).toLocaleDateString()}</span>
                  </div>
                  {template.usage_count && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      Used {template.usage_count}×
                    </span>
                  )}
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePreviewTemplate(template)}
                  >
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
                      onClick={() => handleSetDefault(template.id, template.name)}
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
                          onClick={() => handleDeleteTemplate(template.id, template.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Template
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
