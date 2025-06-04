
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, MapPin, X } from "lucide-react";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface MultiSiteSelectorProps {
  selectedSites: string[];
  onSitesChange: (sites: string[]) => void;
}

const getSiteColor = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800", 
    "bg-purple-100 text-purple-800",
    "bg-orange-100 text-orange-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800"
  ];
  return colors[index % colors.length];
};

export const MultiSiteSelector = ({ selectedSites, onSitesChange }: MultiSiteSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { facilities, loading } = useCompanySettings();

  // Transform facilities to the expected format
  const sites = facilities.map((facility, index) => ({
    id: facility.id,
    name: facility.name,
    color: getSiteColor(index)
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure at least one site is selected when facilities load
  useEffect(() => {
    if (sites.length > 0 && selectedSites.length === 0) {
      onSitesChange([sites[0].id]);
    }
  }, [sites, selectedSites, onSitesChange]);

  const handleSiteToggle = (siteId: string) => {
    if (selectedSites.includes(siteId)) {
      if (selectedSites.length > 1) {
        onSitesChange(selectedSites.filter(id => id !== siteId));
      }
    } else {
      onSitesChange([...selectedSites, siteId]);
    }
  };

  const handleSelectAll = () => {
    onSitesChange(sites.map(site => site.id));
  };

  const handleClearAll = () => {
    if (sites.length > 0) {
      onSitesChange([sites[0].id]); // Keep at least one site selected
    }
  };

  const getDisplayText = () => {
    if (loading) {
      return "Loading...";
    }
    
    if (sites.length === 0) {
      return "No facilities";
    }
    
    if (selectedSites.length === sites.length) {
      return "All Facilities";
    }
    if (selectedSites.length === 1) {
      const site = sites.find(s => s.id === selectedSites[0]);
      return site?.name || "Select facilities";
    }
    return `${selectedSites.length} Facilities`;
  };

  if (loading) {
    return (
      <Button variant="outline" disabled className="min-w-[180px] justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Loading...</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  }

  if (sites.length === 0) {
    return (
      <Button variant="outline" disabled className="min-w-[180px] justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>No facilities</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{getDisplayText()}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 min-w-[280px]">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Select Facilities</h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-6"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs h-6"
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleSiteToggle(site.id)}
                >
                  <Checkbox
                    checked={selectedSites.includes(site.id)}
                    onCheckedChange={() => handleSiteToggle(site.id)}
                  />
                  <Badge className={site.color} variant="secondary">
                    {site.name}
                  </Badge>
                </div>
              ))}
            </div>

            {selectedSites.length > 1 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500 mb-2">Selected:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSites.map((siteId) => {
                    const site = sites.find(s => s.id === siteId);
                    return (
                      <Badge
                        key={siteId}
                        className={site?.color}
                        variant="secondary"
                      >
                        {site?.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSiteToggle(siteId);
                          }}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
