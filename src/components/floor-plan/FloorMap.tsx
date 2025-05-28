
import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Square, Move } from "lucide-react";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
}

interface FloorMapProps {
  units: Unit[];
  onUnitClick: (unitId: string) => void;
}

interface MapUnit {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: string;
  isNew?: boolean;
}

type Tool = 'select' | 'add' | 'move';

export const FloorMap = ({ units, onUnitClick }: FloorMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [draggedUnit, setDraggedUnit] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newUnitCounter, setNewUnitCounter] = useState(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "fill-green-400 stroke-green-500";
      case "occupied":
        return "fill-blue-400 stroke-blue-500";
      case "reserved":
        return "fill-yellow-400 stroke-yellow-500";
      case "maintenance":
        return "fill-red-400 stroke-red-500";
      default:
        return "fill-gray-400 stroke-gray-500";
    }
  };

  // Create initial map units based on existing units
  const [mapUnits, setMapUnits] = useState<MapUnit[]>(() => {
    const initialUnits: MapUnit[] = [
      // Building A - Top row
      { id: "A-101", x: 200, y: 50, width: 80, height: 60, status: units.find(u => u.id === "A-101")?.status || "available" },
      { id: "A-102", x: 300, y: 50, width: 80, height: 60, status: units.find(u => u.id === "A-102")?.status || "available" },
      { id: "A-103", x: 400, y: 50, width: 120, height: 60, status: units.find(u => u.id === "A-103")?.status || "available" },
      
      // Building B - Middle section
      { id: "B-201", x: 150, y: 150, width: 120, height: 100, status: units.find(u => u.id === "B-201")?.status || "available" },
      { id: "B-202", x: 300, y: 150, width: 120, height: 100, status: units.find(u => u.id === "B-202")?.status || "available" },
      
      // Building C - Large units
      { id: "C-301", x: 450, y: 150, width: 160, height: 100, status: units.find(u => u.id === "C-301")?.status || "available" },
    ];
    
    return initialUnits;
  });

  const handleSVGClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'add') {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      const x = ((event.clientX - svgRect.left) / svgRect.width) * 750;
      const y = ((event.clientY - svgRect.top) / svgRect.height) * 400;

      const newUnit: MapUnit = {
        id: `NEW-${newUnitCounter}`,
        x: Math.max(0, x - 40),
        y: Math.max(0, y - 30),
        width: 80,
        height: 60,
        status: "available",
        isNew: true
      };

      setMapUnits(prev => [...prev, newUnit]);
      setNewUnitCounter(prev => prev + 1);
    }
  }, [activeTool, newUnitCounter]);

  const handleUnitMouseDown = useCallback((event: React.MouseEvent, unitId: string) => {
    event.stopPropagation();
    
    if (activeTool === 'move') {
      const unit = mapUnits.find(u => u.id === unitId);
      if (!unit) return;

      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      const x = ((event.clientX - svgRect.left) / svgRect.width) * 750;
      const y = ((event.clientY - svgRect.top) / svgRect.height) * 400;

      setDraggedUnit(unitId);
      setDragOffset({
        x: x - unit.x,
        y: y - unit.y
      });
    } else if (activeTool === 'select') {
      onUnitClick(unitId);
    }
  }, [activeTool, mapUnits, onUnitClick]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedUnit || activeTool !== 'move') return;

    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const x = ((event.clientX - svgRect.left) / svgRect.width) * 750;
    const y = ((event.clientY - svgRect.top) / svgRect.height) * 400;

    setMapUnits(prev => prev.map(unit => 
      unit.id === draggedUnit 
        ? { 
            ...unit, 
            x: Math.max(0, Math.min(750 - unit.width, x - dragOffset.x)),
            y: Math.max(0, Math.min(400 - unit.height, y - dragOffset.y))
          }
        : unit
    ));
  }, [draggedUnit, dragOffset, activeTool]);

  const handleMouseUp = useCallback(() => {
    setDraggedUnit(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const getToolButtonVariant = (tool: Tool) => {
    return activeTool === tool ? "default" : "outline";
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Facility Floor Plan</h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={getToolButtonVariant('select')}
              onClick={() => setActiveTool('select')}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Select
            </Button>
            <Button
              size="sm"
              variant={getToolButtonVariant('move')}
              onClick={() => setActiveTool('move')}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Move
            </Button>
            <Button
              size="sm"
              variant={getToolButtonVariant('add')}
              onClick={() => setActiveTool('add')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Unit
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 border border-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-400 border border-blue-500 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 border border-red-500 rounded"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: "400px", width: "100%" }}>
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 750 400" 
          className={`absolute inset-0 ${activeTool === 'add' ? 'cursor-crosshair' : activeTool === 'move' ? 'cursor-move' : 'cursor-default'}`}
          onClick={handleSVGClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Building outlines */}
          <rect x="40" y="40" width="680" height="320" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Floor plan units */}
          {mapUnits.map((unit) => (
            <g key={unit.id}>
              <rect
                x={unit.x}
                y={unit.y}
                width={unit.width}
                height={unit.height}
                className={`${getStatusColor(unit.status)} stroke-2 ${
                  activeTool === 'move' ? 'cursor-move' : 'cursor-pointer'
                } hover:opacity-80 transition-all ${
                  draggedUnit === unit.id ? 'opacity-60' : ''
                } ${unit.isNew ? 'stroke-dashed' : ''}`}
                onMouseDown={(e) => handleUnitMouseDown(e, unit.id)}
              />
              <text
                x={unit.x + unit.width / 2}
                y={unit.y + unit.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-semibold text-xs pointer-events-none select-none"
                fontSize="12"
              >
                {unit.id}
              </text>
            </g>
          ))}
          
          {/* Building labels */}
          <text x="375" y="30" textAnchor="middle" className="fill-gray-600 font-semibold text-sm">
            Storage Facility Floor Plan
          </text>
          
          {/* Section labels */}
          <text x="100" y="390" textAnchor="middle" className="fill-gray-500 text-xs">Building A</text>
          <text x="350" y="390" textAnchor="middle" className="fill-gray-500 text-xs">Building B</text>
          <text x="550" y="390" textAnchor="middle" className="fill-gray-500 text-xs">Building C</text>
          <text x="650" y="390" textAnchor="middle" className="fill-gray-500 text-xs">Building D</text>
        </svg>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          {activeTool === 'select' && "Click on any unit to view details and perform actions."}
          {activeTool === 'move' && "Click and drag units to reposition them on the floor plan."}
          {activeTool === 'add' && "Click anywhere on the floor plan to add a new unit."}
        </p>
      </div>
    </Card>
  );
};
