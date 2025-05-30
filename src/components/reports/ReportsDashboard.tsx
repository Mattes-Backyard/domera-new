
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Calendar } from "lucide-react";

interface KPI {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ComponentType<any>;
}

const kpis: KPI[] = [
  {
    title: "Occupancy Rate",
    value: "87.3%",
    change: "+5.2%",
    changeType: "positive",
    icon: Package
  },
  {
    title: "Monthly Revenue",
    value: "$24,580",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign
  },
  {
    title: "Active Tenants",
    value: "847",
    change: "+23",
    changeType: "positive",
    icon: Users
  },
  {
    title: "Avg. Lease Duration",
    value: "14.2 months",
    change: "-0.8",
    changeType: "negative",
    icon: Calendar
  }
];

export const ReportsDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Dashboard</h1>
        <p className="text-gray-600">Key performance indicators and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                {kpi.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : kpi.changeType === "negative" ? (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                ) : null}
                <span className={`text-xs ${
                  kpi.changeType === "positive" 
                    ? "text-green-600" 
                    : kpi.changeType === "negative" 
                      ? "text-red-600" 
                      : "text-gray-600"
                }`}>
                  {kpi.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Site Performance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Site Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Helsingborg", "Lund", "Malmö"].map((site) => (
              <div key={site} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{site}</div>
                  <div className="text-sm text-gray-600">150 total units</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">92%</div>
                    <div className="text-sm text-gray-600">Occupancy</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$8,200</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Revenue chart visualization would be implemented here</p>
              <p className="text-sm">Integration with charting library like Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
