
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
    bgColor: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    title: "Create Invoice",
    icon: FileText,
    bgColor: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Report Issue",
    icon: AlertTriangle,
    bgColor: "bg-orange-500 hover:bg-orange-600",
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
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.bgColor} text-white border-none hover:scale-105 transition-all duration-300 shadow-lg`}
              onClick={() => handleActionClick(action.id || "")}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
