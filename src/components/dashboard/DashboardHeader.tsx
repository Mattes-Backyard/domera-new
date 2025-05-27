
import { Bell, Search, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchResults } from "./SearchResults";
import { useState, useRef, useEffect } from "react";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  status: string;
}

interface DashboardHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchResultClick?: (type: 'unit' | 'customer', id: string) => void;
  units?: Unit[];
  customers?: Customer[];
}

export const DashboardHeader = ({ 
  searchQuery = "", 
  onSearchChange, 
  onSearchResultClick,
  units = [],
  customers = []
}: DashboardHeaderProps) => {
  const [showResults, setShowResults] = useState(false);
  const [selectedSite, setSelectedSite] = useState("helsingborg");
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim() ? {
    units: units.filter(unit => 
      unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.tenant && unit.tenant.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    customers: customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    )
  } : { units: [], customers: [] };

  const hasResults = searchResults.units.length > 0 || searchResults.customers.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
    setShowResults(value.trim().length > 0);
  };

  const handleResultClick = (type: 'unit' | 'customer', id: string) => {
    onSearchResultClick?.(type, id);
    setShowResults(false);
    onSearchChange?.("");
  };

  const clearSearch = () => {
    onSearchChange?.("");
    setShowResults(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        <SidebarTrigger />
        
        <Select value={selectedSite} onValueChange={setSelectedSite}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="helsingborg">Helsingborg</SelectItem>
            <SelectItem value="lund">Lund</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search units, customers, or invoices..."
            className="pl-10 pr-10 w-80"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {showResults && (searchQuery.trim() || hasResults) && (
            <SearchResults
              searchQuery={searchQuery}
              searchResults={searchResults}
              onResultClick={handleResultClick}
            />
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
