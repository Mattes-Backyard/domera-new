import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { UserMenu } from "@/components/auth/UserMenu";
import { CompanyLogo } from "@/components/ui/company-logo";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdminClick: () => void;
}

export const DashboardHeader = ({ searchQuery, onSearchChange, onAdminClick }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CompanyLogo size="md" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">StorageFlow</h1>
          </div>
        </div>

        
        <div className="flex items-center space-x-4">
          
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-md rounded-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          
          <NotificationDropdown />
          <UserMenu onAdminClick={onAdminClick} />
        </div>
      </div>
    </header>
  );
};
