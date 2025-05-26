
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface QuickActionsProps {
  onAddUnit?: () => void;
  onAddCustomer?: (customer: any) => void;
}

const actions = [
  {
    id: "add-unit",
    title: "Add Unit",
    icon: Package,
    bgColor: "bg-blue-600 hover:bg-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Create Invoice",
    icon: FileText,
    bgColor: "bg-teal-600 hover:bg-teal-700",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    title: "Report Issue",
    icon: AlertTriangle,
    bgColor: "bg-amber-600 hover:bg-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export const QuickActions = ({ onAddUnit }: QuickActionsProps) => {
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "add-unit":
        onAddUnit?.();
        break;
      default:
        break;
    }
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center space-y-3 ${action.bgColor} text-white border-0 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
              onClick={() => handleActionClick(action.id || "")}
            >
              <div className={`p-2 rounded-full ${action.iconBg}`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
