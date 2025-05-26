
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", occupancy: 78, rented: 78, available: 22 },
  { month: "Feb", occupancy: 82, rented: 82, available: 18 },
  { month: "Mar", occupancy: 85, rented: 85, available: 15 },
  { month: "Apr", occupancy: 83, rented: 83, available: 17 },
  { month: "May", occupancy: 87, rented: 87, available: 13 },
  { month: "Jun", occupancy: 89, rented: 89, available: 11 },
];

export const OccupancyChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Occupancy Trends (Rented vs Available Units)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name) => [
                `${value}%`, 
                name === 'occupancy' ? 'Occupancy Rate' : 
                name === 'rented' ? 'Rented Units' : 'Available Units'
              ]}
            />
            <Line
              type="monotone"
              dataKey="occupancy"
              stroke="#3b82f6"
              strokeWidth={3}
              name="occupancy"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Occupancy Rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
