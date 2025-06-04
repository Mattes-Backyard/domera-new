
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { UserMenu } from "@/components/auth/UserMenu";
import { CompanyLogo } from "@/components/ui/company-logo";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdminClick: () => void;
  onSearchResultClick?: (type: 'unit' | 'customer', id: string) => void;
  units?: any[];
  customers?: any[];
  onFloorPlanClick?: () => void;
  selectedSites?: string[];
  onSitesChange?: (sites: string[]) => void;
}

export const DashboardHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onAdminClick,
  onSearchResultClick,
  units,
  customers,
  onFloorPlanClick,
  selectedSites,
  onSitesChange
}: DashboardHeaderProps) => {
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
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="max-w-md rounded-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          
          <NotificationDropdown />
          <UserMenu onAdminClick={onAdminClick} />
        </div>
      </div>
    </header>
  );
};
