
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
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200";
      case "received":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-blue-400 to-purple-500",
      "from-emerald-400 to-teal-500", 
      "from-orange-400 to-red-500",
      "from-purple-400 to-pink-500",
    ];
    return gradients[name.length % gradients.length];
  };

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-md">
              <Avatar className="ring-2 ring-white shadow-lg">
                <AvatarFallback className={`bg-gradient-to-r ${getAvatarGradient(activity.customer)} text-white font-medium`}>
                  {activity.customer.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.customer}
                </p>
                <p className="text-sm text-gray-600">
                  {activity.type} - Unit {activity.unit}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(activity.status)} border shadow-sm`}>
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
