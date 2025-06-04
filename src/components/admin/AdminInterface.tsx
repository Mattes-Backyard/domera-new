
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettings } from "./CompanySettings";
import { FacilityManagement } from "./FacilityManagement";
import { AddUserDialog } from "./AddUserDialog";
import { UserList } from "./UserList";
import { AdminRoleDebug } from "./AdminRoleDebug";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { CompanyLogo } from "@/components/ui/company-logo";

export const AdminInterface = () => {
  const { facilities, refreshData, companyInfo } = useCompanySettings();

  const handleUserAdded = () => {
    refreshData();
  };

  const handleTabChange = (value: string) => {
    console.log('AdminInterface: Tab changed to', value);
    // Refresh data when switching to company tab to ensure fresh data
    if (value === 'company') {
      refreshData();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <CompanyLogo size="lg" />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage system settings and configurations for {companyInfo?.company_name || 'your company'}
          </p>
        </div>
      </div>

      <AdminRoleDebug />

      <Tabs defaultValue="users" className="space-y-6" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">User Management</h2>
            <AddUserDialog facilities={facilities} onUserAdded={handleUserAdded} />
          </div>
          
          <UserList />
        </TabsContent>

        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="facilities">
          <FacilityManagement />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">Advanced system configuration options will be available here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
