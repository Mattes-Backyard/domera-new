
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { UserMenu } from "@/components/auth/UserMenu";
import { MultiSiteSelector } from "@/components/dashboard/MultiSiteSelector";

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
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Facility Selector */}
        <div className="flex items-center">
          {selectedSites && onSitesChange && (
            <MultiSiteSelector 
              selectedSites={selectedSites}
              onSitesChange={onSitesChange}
            />
          )}
        </div>

        {/* Right side - Search, Notifications, and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search units, customers, or anything..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-gray-50/70 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 placeholder:text-gray-400"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => onSearchChange('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-gray-200"></div>
          
          {/* Notifications */}
          <div className="relative">
            <NotificationDropdown />
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <UserMenu onAdminClick={onAdminClick} />
          </div>
        </div>
      </div>
    </header>
  );
};
