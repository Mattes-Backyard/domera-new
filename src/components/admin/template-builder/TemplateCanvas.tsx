
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { TemplateComponent } from '@/hooks/useInvoiceTemplates';
import { CanvasComponent } from './CanvasComponent';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, ZoomIn, ZoomOut, Grid } from 'lucide-react';

interface TemplateCanvasProps {
  components: TemplateComponent[];
  onDrop: (item: any, offset: { x: number; y: number }) => void;
  onComponentUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
  onComponentDelete: (id: string) => void;
  onComponentSelect: (id: string | null) => void;
  selectedComponentId: string | null;
  colors: any;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onGridToggle: () => void;
}

export const TemplateCanvas: React.FC<TemplateCanvasProps> = ({
  components,
  onDrop,
  onComponentUpdate,
  onComponentDelete,
  onComponentSelect,
  selectedComponentId,
  colors,
  zoom,
  onZoomChange,
  showGrid,
  onGridToggle
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['COMPONENT', 'EXISTING_COMPONENT'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = dropRef.current?.getBoundingClientRect();
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

  const combinedRef = (node: HTMLDivElement) => {
    dropRef.current = node;
    drop(node);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant={showGrid ? "default" : "outline"}
            size="sm"
            onClick={onGridToggle}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
            disabled={zoom >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div
          ref={combinedRef}
          className={`relative mx-auto bg-white border-2 border-dashed transition-all duration-200 ${
            isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${showGrid ? 'canvas-grid' : ''}`}
          style={{
            width: `${297 * zoom}px`, // A4 width at scale
            height: `${420 * zoom}px`, // A4 height at scale
            backgroundColor: colors.background,
            backgroundImage: showGrid ? 
              `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)` : 
              'none',
            backgroundSize: showGrid ? `${20 * zoom}px ${20 * zoom}px` : 'auto',
          }}
          onClick={() => onComponentSelect(null)}
        >
          {components.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              onUpdate={onComponentUpdate}
              onDelete={onComponentDelete}
              onSelect={onComponentSelect}
              isSelected={selectedComponentId === component.id}
              zoom={zoom}
            />
          ))}
          
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg mb-2">Drop components here to build your template</p>
                <p className="text-sm">Start with a header component</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
