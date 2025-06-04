
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Package, Users, BarChart3, Settings, CreditCard, AlertTriangle, Zap, Wrench, CheckSquare, Calendar, Shield, UserCog, Plug } from "lucide-react";

interface DashboardNavigationMenuProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    category: "Main"
  },
  {
    id: "units",
    title: "Units",
    icon: Package,
    category: "Management"
  },
  {
    id: "customers",
    title: "Customers",
    icon: Users,
    category: "Management"
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: CheckSquare,
    category: "Operations"
  },
  {
    id: "operations",
    title: "Operations",
    icon: Wrench,
    category: "Operations"
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
    category: "Finance"
  },
  {
    id: "reservations",
    title: "Reservations",
    icon: Calendar,
    category: "Operations"
  },
  {
    id: "access-control",
    title: "Access Control",
    icon: Shield,
    category: "Security"
  },
  {
    id: "reports",
    title: "Reports",
    icon: BarChart3,
    category: "Analytics"
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: Plug,
    category: "Settings"
  },
  {
    id: "admin",
    title: "Admin Panel",
    icon: UserCog,
    category: "Settings"
  }
];

const categories = {
  Main: menuItems.filter(item => item.category === "Main"),
  Management: menuItems.filter(item => item.category === "Management"),
  Operations: menuItems.filter(item => item.category === "Operations"),
  Finance: menuItems.filter(item => item.category === "Finance"),
  Security: menuItems.filter(item => item.category === "Security"),
  Analytics: menuItems.filter(item => item.category === "Analytics"),
  Settings: menuItems.filter(item => item.category === "Settings")
};

export const DashboardNavigationMenu = ({ activeView, onNavigate }: DashboardNavigationMenuProps) => {
  return (
    <NavigationMenu className="bg-white border-b border-gray-200 px-6 py-2">
      <NavigationMenuList className="space-x-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            Management
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              {categories.Management.map((item) => (
                <NavigationMenuLink
                  key={item.id}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                    activeView === item.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onNavigate(item.id)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                  </div>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            Operations
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              {categories.Operations.map((item) => (
                <NavigationMenuLink
                  key={item.id}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                    activeView === item.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onNavigate(item.id)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                  </div>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            Finance & Analytics
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              {[...categories.Finance, ...categories.Analytics].map((item) => (
                <NavigationMenuLink
                  key={item.id}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                    activeView === item.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onNavigate(item.id)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                  </div>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            Settings
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              {[...categories.Security, ...categories.Settings].map((item) => (
                <NavigationMenuLink
                  key={item.id}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                    activeView === item.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onNavigate(item.id)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                  </div>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
