
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
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverBg: "hover:bg-blue-50",
  },
  {
    title: "Create Invoice",
    icon: FileText,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    hoverBg: "hover:bg-teal-50",
  },
  {
    title: "Report Issue",
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    hoverBg: "hover:bg-amber-50",
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
              className={`h-24 flex flex-col items-center justify-center space-y-3 bg-white ${action.hoverBg} text-slate-700 border border-slate-200 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md`}
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
