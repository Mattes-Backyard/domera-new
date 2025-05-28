
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Unit } from "@/hooks/useAppState";

interface OccupancyChartProps {
  units: Unit[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "occupied":
      return "#22c55e"; // green-500
    case "available":
      return "#3b82f6"; // blue-500
    case "reserved":
      return "#f59e0b"; // amber-500
    case "maintenance":
      return "#ef4444"; // red-500
    default:
      return "#6b7280"; // gray-500
  }
};

const getUnitSizeInSqMeters = (size: string): number => {
  // Convert size like "5x5" to square meters
  const [width, height] = size.split('x').map(Number);
  // Assuming the size is in feet, convert to square meters (1 foot = 0.092903 sq meters)
  return Math.round(width * height * 0.092903);
};

export const OccupancyChart = ({ units }: OccupancyChartProps) => {
  // Generate monthly data based on current units (simulating historical data)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  const data = months.map((month, index) => {
    // Simulate slight variations for historical data
    const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
    
    const statusCounts = {
      occupied: 0,
      available: 0,
      reserved: 0,
      maintenance: 0
    };

    const statusSqMeters = {
      occupied: 0,
      available: 0,
      reserved: 0,
      maintenance: 0
    };

    units.forEach(unit => {
      const sqMeters = getUnitSizeInSqMeters(unit.size);
      // Add some historical variation
      const adjustedStatus = Math.random() > 0.8 ? 'available' : unit.status;
      
      if (statusCounts.hasOwnProperty(adjustedStatus)) {
        statusCounts[adjustedStatus as keyof typeof statusCounts]++;
        statusSqMeters[adjustedStatus as keyof typeof statusSqMeters] += sqMeters;
      }
    });

    const totalUnits = units.length;
    const totalSqMeters = units.reduce((sum, unit) => sum + getUnitSizeInSqMeters(unit.size), 0);

    return {
      month,
      occupied: Math.round((statusCounts.occupied / totalUnits) * 100),
      available: Math.round((statusCounts.available / totalUnits) * 100),
      reserved: Math.round((statusCounts.reserved / totalUnits) * 100),
      maintenance: Math.round((statusCounts.maintenance / totalUnits) * 100),
      occupiedSqM: statusSqMeters.occupied,
      availableSqM: statusSqMeters.available,
      reservedSqM: statusSqMeters.reserved,
      maintenanceSqM: statusSqMeters.maintenance,
      totalSqM: totalSqMeters
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Unit Status Trends (Square Meters)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name) => {
                const statusNames = {
                  occupied: 'Occupied',
                  available: 'Available', 
                  reserved: 'Reserved',
                  maintenance: 'Maintenance'
                };
                return [
                  `${value}%`, 
                  statusNames[name as keyof typeof statusNames] || name
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="occupied"
              stroke={getStatusColor("occupied")}
              strokeWidth={3}
              name="occupied"
              dot={{ fill: getStatusColor("occupied"), strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="available"
              stroke={getStatusColor("available")}
              strokeWidth={3}
              name="available"
              dot={{ fill: getStatusColor("available"), strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="reserved"
              stroke={getStatusColor("reserved")}
              strokeWidth={3}
              name="reserved"
              dot={{ fill: getStatusColor("reserved"), strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="maintenance"
              stroke={getStatusColor("maintenance")}
              strokeWidth={3}
              name="maintenance"
              dot={{ fill: getStatusColor("maintenance"), strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center space-x-6 text-sm flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("occupied") }}></div>
            <span className="text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("available") }}></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("reserved") }}></div>
            <span className="text-gray-600">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor("maintenance") }}></div>
            <span className="text-gray-600">Maintenance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
