import { Users, Package, BarChart3, Settings, CreditCard, AlertTriangle, Zap, Wrench, CheckSquare, ChevronDown, Plug, Calendar, Shield, UserCog } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { CompanyLogo } from "@/components/ui/company-logo";

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "units",
    title: "Units",
    icon: Package,
  },
  {
    id: "customers",
    title: "Customers",
    icon: Users,
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: CheckSquare,
  },
  {
    id: "operations",
    title: "Operations",
    icon: Wrench,
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
  },
  {
    id: "maintenance",
    title: "Maintenance",
    icon: AlertTriangle,
  },
  {
    id: "automation",
    title: "AI Automation",
    icon: Zap,
  },
  {
    id: "reservations",
    title: "Reservations",
    icon: Calendar,
    description: "Online unit booking"
  },
  {
    id: "access-control", 
    title: "Access Control",
    icon: Shield,
    description: "Entry management"
  },
  {
    id: "reports",
    title: "Reports",
    icon: BarChart3,
    description: "Analytics & KPIs"
  }
];

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const DashboardSidebar = ({ activeView, setActiveView }: DashboardSidebarProps) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const handleMenuClick = (viewId: string) => {
    console.log('Sidebar menu clicked:', viewId);
    setActiveView(viewId);
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <CompanyLogo size="sm" className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Domera</h2>
            <p className="text-sm text-gray-500">Storage Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start cursor-pointer hover:bg-sidebar-accent"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer hover:bg-sidebar-accent">
                      <Settings className="h-4 w-4" />
                      <span>System Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => handleMenuClick("integrations")}
                          isActive={activeView === "integrations"}
                          className="cursor-pointer hover:bg-sidebar-accent"
                        >
                          <Plug className="h-4 w-4" />
                          <span>Integrations</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {isAdmin && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton 
                            onClick={() => handleMenuClick("admin")}
                            isActive={activeView === "admin"}
                            className="cursor-pointer hover:bg-sidebar-accent"
                          >
                            <UserCog className="h-4 w-4" />
                            <span>Admin Panel</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
