
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Package, DollarSign, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$84,320",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Occupancy Rate",
    value: "87.3%",
    change: "+2.1%",
    trend: "up",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Active Customers",
    value: "342",
    change: "+8",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Overdue Payments",
    value: "12",
    change: "-3",
    trend: "down",
    icon: AlertCircle,
    color: "text-orange-600",
  },
];

export const OverviewStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center text-xs text-gray-500">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
