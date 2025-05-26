
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Package, FileText, AlertTriangle } from "lucide-react";

interface QuickActionsProps {
  onAddCustomer?: () => void;
  onAddUnit?: () => void;
}

const actions = [
  {
    id: "add-customer",
    title: "Add Customer",
    icon: Users,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "add-unit",
    title: "Add Unit",
    icon: Package,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Create Invoice",
    icon: FileText,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Report Issue",
    icon: AlertTriangle,
    color: "bg-orange-500 hover:bg-orange-600",
  },
];

export const QuickActions = ({ onAddCustomer, onAddUnit }: QuickActionsProps) => {
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "add-customer":
        onAddCustomer?.();
        break;
      case "add-unit":
        onAddUnit?.();
        break;
      default:
        // Handle other actions if needed
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color} text-white border-none hover:scale-105 transition-transform`}
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
