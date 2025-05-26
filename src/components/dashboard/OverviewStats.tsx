
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, TrendingDown, DollarSign, AlertCircle, Settings } from "lucide-react";

const stats = [
  {
    title: "Credit Card",
    subtitle: "All",
    sections: [
      { label: "Current Month", value: "No Data", icon: null },
      { label: "Last Month", value: "Count: 30", link: true }
    ],
    color: "bg-cyan-500",
    icon: CreditCard,
  },
  {
    title: "Revenue",
    subtitle: "All", 
    sections: [
      { label: "Last Month", value: "408 784,72 kr", icon: null },
      { label: "Current Month", value: "396 421,60 kr", icon: null },
      { label: "Next Month", value: "402 769,00 kr", icon: null }
    ],
    color: "bg-green-500",
    icon: DollarSign,
  },
  {
    title: "Total Overdue",
    subtitle: "",
    sections: [
      { label: "Last 7 days", value: "1 108,28 kr", icon: null },
      { label: "Last 30 days", value: "78 662,94 kr", icon: null },
      { label: "> 30 days", value: "31 821,11 kr", icon: null }
    ],
    color: "bg-pink-500",
    icon: AlertCircle,
  },
];

const moveStats = [
  {
    title: "Move Ins",
    subtitle: "(Today)",
    value: "3",
    details: ["Admin Move Ins: 0", "Online Move Ins: 3"],
    color: "border-l-green-400",
    bgColor: "bg-green-50",
  },
  {
    title: "Move Outs", 
    subtitle: "(Today)",
    value: "0",
    details: [],
    color: "border-l-red-400",
    bgColor: "bg-red-50",
  },
  {
    title: "Scheduled Move Outs",
    subtitle: "(Today)", 
    value: "0",
    details: ["Admin Scheduled Move Outs: 0", "Online Scheduled"],
    color: "border-l-blue-400",
    bgColor: "bg-blue-50",
  }
];

export const OverviewStats = () => {
  return (
    <div className="space-y-6">
      {/* Financial Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className={`${stat.color} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {stat.title} <span className="text-sm font-normal">{stat.subtitle}</span>
                  </CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Settings className="h-4 w-4" />
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {stat.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {section.icon && <section.icon className="h-4 w-4 text-gray-500" />}
                    <span className="text-sm text-gray-600">{section.label}</span>
                  </div>
                  <span className={`text-sm font-medium ${section.link ? 'text-cyan-500 cursor-pointer hover:underline' : 'text-gray-900'}`}>
                    {section.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Move Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moveStats.map((stat, index) => (
          <Card key={index} className={`border-l-4 ${stat.color} ${stat.bgColor}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title} <span className="text-xs">{stat.subtitle}</span>
                </CardTitle>
                <Settings className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              {stat.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="text-xs text-gray-500">{detail}</div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
