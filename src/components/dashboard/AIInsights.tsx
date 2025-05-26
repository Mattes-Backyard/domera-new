
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
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const getConfidenceGradient = (confidence: number) => {
    if (confidence >= 90) return "from-emerald-400 to-teal-500";
    if (confidence >= 80) return "from-blue-400 to-indigo-500";
    return "from-yellow-400 to-orange-500";
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-white to-slate-50 border border-indigo-100 rounded-lg hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:scale-102">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
                    <insight.icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                </div>
                <Badge className={`${getImpactColor(insight.impact)} border shadow-sm`}>
                  {insight.impact}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{insight.message}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Confidence: {insight.confidence}%
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-1.5 shadow-inner">
                  <div 
                    className={`bg-gradient-to-r ${getConfidenceGradient(insight.confidence)} h-1.5 rounded-full shadow-sm transition-all duration-500`}
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
