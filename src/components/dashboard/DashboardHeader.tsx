import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Map, Bell, Plus } from "lucide-react";
import { SearchResults } from "./SearchResults";
import { NotificationDropdown } from "./NotificationDropdown";
import { MultiSiteSelector } from "./MultiSiteSelector";
import { UserMenu } from "@/components/auth/UserMenu";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchResultClick: (type: 'unit' | 'customer', id: string) => void;
  units: any[];
  customers: any[];
  onFloorPlanClick: () => void;
  selectedSites: string[];
  onSitesChange: (sites: string[]) => void;
}

export const DashboardHeader = ({
  searchQuery,
  onSearchChange,
  onSearchResultClick,
  units,
  customers,
  onFloorPlanClick,
  selectedSites,
  onSitesChange,
}: DashboardHeaderProps) => {
  const [showResults, setShowResults] = useState(false);

  // Enhanced search result click handler
  const handleSearchResultClick = (type: 'unit' | 'customer', id: string) => {
    onSearchResultClick(type, id);
    setShowResults(false);
    onSearchChange(""); // Clear the search query after a result is clicked
  };

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search units, customers..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowResults(e.target.value.length > 0);
                }}
                onFocus={() => setShowResults(searchQuery.length > 0)}
                className="pl-10 w-64 lg:w-80"
              />
              {showResults && (
                <SearchResults
                  query={searchQuery}
                  units={units}
                  customers={customers}
                  onResultClick={(type, id) => {
                    handleSearchResultClick(type, id);
                    setShowResults(false);
                    onSearchChange("");
                  }}
                  onClose={() => setShowResults(false)}
                />
              )}
            </div>
            
            <MultiSiteSelector
              selectedSites={selectedSites}
              onSitesChange={onSitesChange}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFloorPlanClick}
            className="hidden sm:flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            Floor Plan
          </Button>
          
          <NotificationDropdown />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
