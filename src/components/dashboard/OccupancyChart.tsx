
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", occupancy: 78, revenue: 72000 },
  { month: "Feb", occupancy: 82, revenue: 76000 },
  { month: "Mar", occupancy: 85, revenue: 79000 },
  { month: "Apr", occupancy: 83, revenue: 78000 },
  { month: "May", occupancy: 87, revenue: 84000 },
  { month: "Jun", occupancy: 89, revenue: 87000 },
];

export const OccupancyChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Occupancy & Revenue Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="occupancy"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Occupancy %"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              name="Revenue $"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
