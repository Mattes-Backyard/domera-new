
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, AlertTriangle } from "lucide-react";

const stats = [
  {
    title: "Monthly Revenue",
    value: "$24,580",
    change: "+12.5%",
    changeType: "positive",
    icon: CreditCard,
    description: "From 847 active units",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Collections Rate",
    value: "96.2%",
    change: "+2.1%",
    changeType: "positive", 
    icon: TrendingUp,
    description: "Above industry average",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
  },
  {
    title: "Outstanding Balance",
    value: "$3,240",
    change: "-15.3%",
    changeType: "negative",
    icon: AlertTriangle,
    description: "Across 23 units",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
];

export const OverviewStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.iconBg} shadow-sm`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {stat.value}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-slate-600">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
