
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Unit } from "@/hooks/useAppState";

interface OccupancyChartProps {
  units: Unit[];
}

// Convert unit sizes to square meters
const getSizeInSqM = (size: string): number => {
  const [width, height] = size.split('x').map(Number);
  return width * height;
};

// Generate monthly data based on current unit status
const generateMonthlyData = (units: Unit[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  const totalSqM = units.reduce((total, unit) => total + getSizeInSqM(unit.size), 0);
  const rentedSqM = units
    .filter(unit => unit.status === "occupied")
    .reduce((total, unit) => total + getSizeInSqM(unit.size), 0);
  const availableSqM = units
    .filter(unit => unit.status === "available")
    .reduce((total, unit) => total + getSizeInSqM(unit.size), 0);
  const maintenanceSqM = units
    .filter(unit => unit.status === "maintenance")
    .reduce((total, unit) => total + getSizeInSqM(unit.size), 0);
  const reservedSqM = units
    .filter(unit => unit.status === "reserved")
    .reduce((total, unit) => total + getSizeInSqM(unit.size), 0);

  // Generate trend data showing gradual growth to current state
  return months.map((month, index) => {
    const progress = (index + 1) / months.length;
    return {
      month,
      rented: Math.round(rentedSqM * (0.7 + 0.3 * progress)),
      available: Math.round(availableSqM * (1.3 - 0.3 * progress)),
      maintenance: Math.round(maintenanceSqM * progress),
      reserved: Math.round(reservedSqM * progress),
      total: totalSqM,
    };
  });
};

export const OccupancyChart = ({ units }: OccupancyChartProps) => {
  const data = generateMonthlyData(units);
  const currentData = data[data.length - 1];
  
  const occupancyRate = Math.round((currentData.rented / currentData.total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Storage Occupancy Trends (Square Meters)
        </CardTitle>
        <div className="text-sm text-gray-600">
          Current Occupancy: {occupancyRate}% • Total: {currentData.total} m²
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Square Meters', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => [
                `${value} m²`, 
                name === 'rented' ? 'Rented Storage' : 
                name === 'available' ? 'Available Storage' :
                name === 'maintenance' ? 'Under Maintenance' :
                name === 'reserved' ? 'Reserved Storage' : name
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="rented"
              stackId="1"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.7}
              name="rented"
            />
            <Area
              type="monotone"
              dataKey="reserved"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.7}
              name="reserved"
            />
            <Area
              type="monotone"
              dataKey="maintenance"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.7}
              name="maintenance"
            />
            <Area
              type="monotone"
              dataKey="available"
              stackId="1"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.7}
              name="available"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Rented: {currentData.rented} m²</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">Available: {currentData.available} m²</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Reserved: {currentData.reserved} m²</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Maintenance: {currentData.maintenance} m²</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
