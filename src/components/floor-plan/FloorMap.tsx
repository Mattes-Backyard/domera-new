
import { Card } from "@/components/ui/card";

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
}

export const FloorMap = ({ units, onUnitClick }: FloorMapProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-400 border-green-500";
      case "occupied":
        return "bg-blue-400 border-blue-500";
      case "reserved":
        return "bg-yellow-400 border-yellow-500";
      case "maintenance":
        return "bg-red-400 border-red-500";
      default:
        return "bg-gray-400 border-gray-500";
    }
  };

  // Create a floor plan layout based on the units
  const mapUnits: MapUnit[] = [
    // Building A - Top row
    { id: "A-101", x: 200, y: 50, width: 80, height: 60, status: units.find(u => u.id === "A-101")?.status || "available" },
    { id: "A-102", x: 300, y: 50, width: 80, height: 60, status: units.find(u => u.id === "A-102")?.status || "available" },
    { id: "A-103", x: 400, y: 50, width: 120, height: 60, status: units.find(u => u.id === "A-103")?.status || "available" },
    
    // Building B - Middle section
    { id: "B-201", x: 150, y: 150, width: 120, height: 100, status: units.find(u => u.id === "B-201")?.status || "available" },
    { id: "B-202", x: 300, y: 150, width: 120, height: 100, status: units.find(u => u.id === "B-202")?.status || "available" },
    
    // Building C - Large units
    { id: "C-301", x: 450, y: 150, width: 160, height: 100, status: units.find(u => u.id === "C-301")?.status || "available" },
    
    // Additional units to fill the layout
    { id: "A-201", x: 50, y: 150, width: 80, height: 60, status: "available" },
    { id: "A-202", x: 50, y: 230, width: 80, height: 60, status: "occupied" },
    { id: "B-101", x: 200, y: 280, width: 100, height: 80, status: "maintenance" },
    { id: "B-102", x: 320, y: 280, width: 100, height: 80, status: "reserved" },
    { id: "C-101", x: 450, y: 280, width: 120, height: 80, status: "available" },
    { id: "D-001", x: 600, y: 50, width: 100, height: 140, status: "occupied" },
    { id: "D-002", x: 600, y: 210, width: 100, height: 150, status: "available" },
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Facility Floor Plan</h3>
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
          width="100%" 
          height="100%" 
          viewBox="0 0 750 400" 
          className="absolute inset-0"
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
                className={`${getStatusColor(unit.status)} cursor-pointer hover:opacity-80 transition-opacity border-2`}
                onClick={() => onUnitClick(unit.id)}
              />
              <text
                x={unit.x + unit.width / 2}
                y={unit.y + unit.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-semibold text-xs pointer-events-none"
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
        <p>Click on any unit to view details, edit information, or perform actions.</p>
      </div>
    </Card>
  );
};
