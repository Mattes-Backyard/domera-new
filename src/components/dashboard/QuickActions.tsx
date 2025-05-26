
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, FileText, AlertTriangle } from "lucide-react";

interface QuickActionsProps {
  onAddUnit?: () => void;
}

const actions = [
  {
    id: "add-unit",
    title: "Add Unit",
    icon: Package,
    gradient: "from-emerald-500 to-teal-600",
    hoverGradient: "from-emerald-600 to-teal-700",
    shadow: "shadow-emerald-200",
  },
  {
    title: "Create Invoice",
    icon: FileText,
    gradient: "from-purple-500 to-violet-600",
    hoverGradient: "from-purple-600 to-violet-700",
    shadow: "shadow-purple-200",
  },
  {
    title: "Report Issue",
    icon: AlertTriangle,
    gradient: "from-orange-500 to-amber-600",
    hoverGradient: "from-orange-600 to-amber-700",
    shadow: "shadow-orange-200",
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
              className={`h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r ${action.gradient} text-white border-none hover:bg-gradient-to-r hover:${action.hoverGradient} hover:scale-105 transition-all duration-300 shadow-lg ${action.shadow}`}
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
