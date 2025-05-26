
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, DollarSign } from "lucide-react";

const insights = [
  {
    type: "pricing",
    title: "Pricing Optimization",
    message: "Consider increasing 10x10 unit rates by 8% based on high demand",
    confidence: 92,
    impact: "high",
    icon: DollarSign,
  },
  {
    type: "occupancy",
    title: "Occupancy Forecast",
    message: "Expected 95% occupancy in next 30 days - prepare waitlist",
    confidence: 87,
    impact: "medium",
    icon: TrendingUp,
  },
  {
    type: "maintenance",
    title: "Maintenance Alert",
    message: "Unit C-205 climate control may need attention based on sensor data",
    confidence: 78,
    impact: "low",
    icon: AlertCircle,
  },
];

export const AIInsights = () => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <insight.icon className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                </div>
                <Badge className={getImpactColor(insight.impact)}>
                  {insight.impact}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Confidence: {insight.confidence}%
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full" 
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
