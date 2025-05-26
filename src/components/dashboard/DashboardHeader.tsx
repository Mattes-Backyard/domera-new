
import { Bell, Search, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SiteSelector } from "./SiteSelector";
import { SearchResults } from "./SearchResults";
import { useState, useRef, useEffect } from "react";

interface DashboardHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchResultClick?: (type: 'unit' | 'customer', id: string) => void;
}

const units = [
  { id: "A-101", size: "5x5", type: "Standard", status: "occupied", tenant: "John Smith", tenantId: "john-smith", rate: 85, climate: true },
  { id: "A-102", size: "5x5", type: "Standard", status: "available", tenant: null, tenantId: null, rate: 85, climate: true },
  { id: "A-103", size: "5x10", type: "Standard", status: "reserved", tenant: "Sarah Johnson", tenantId: "sarah-johnson", rate: 120, climate: true },
  { id: "B-201", size: "10x10", type: "Premium", status: "occupied", tenant: "Mike Wilson", tenantId: "mike-wilson", rate: 180, climate: true },
  { id: "B-202", size: "10x10", type: "Premium", status: "maintenance", tenant: null, tenantId: null, rate: 180, climate: true },
  { id: "C-301", size: "10x20", type: "Large", status: "available", tenant: null, tenantId: null, rate: 280, climate: false },
];

const customers = [
  { id: "john-smith", name: "John Smith", email: "john.smith@email.com", phone: "(555) 123-4567", units: ["A-101"], status: "active" },
  { id: "sarah-johnson", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 234-5678", units: ["A-103"], status: "reserved" },
  { id: "mike-wilson", name: "Mike Wilson", email: "mike.wilson@email.com", phone: "(555) 345-6789", units: ["B-201", "C-301"], status: "active" },
  { id: "emily-davis", name: "Emily Davis", email: "emily.davis@email.com", phone: "(555) 456-7890", units: [], status: "former" },
];

export const DashboardHeader = ({ searchQuery = "", onSearchChange, onSearchResultClick }: DashboardHeaderProps) => {
  const [showResults, setShowResults] = useState(false);
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
        <SiteSelector />
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
