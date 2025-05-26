
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "move-in",
    customer: "John Smith",
    unit: "A-101",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "payment",
    customer: "Sarah Johnson",
    unit: "B-205",
    time: "4 hours ago",
    status: "received",
  },
  {
    id: 3,
    type: "maintenance",
    customer: "Mike Wilson",
    unit: "C-310",
    time: "6 hours ago",
    status: "pending",
  },
  {
    id: 4,
    type: "move-out",
    customer: "Emily Davis",
    unit: "A-150",
    time: "1 day ago",
    status: "completed",
  },
];

export const RecentActivity = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "received":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Avatar>
                <AvatarFallback>
                  {activity.customer.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.customer}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.type} - Unit {activity.unit}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
