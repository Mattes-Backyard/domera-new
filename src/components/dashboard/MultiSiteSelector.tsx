
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, MapPin, X, Building2 } from "lucide-react";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface MultiSiteSelectorProps {
  selectedSites: string[];
  onSitesChange: (sites: string[]) => void;
}

const getSiteColor = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200", 
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200"
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
      <Button variant="outline" disabled className="min-w-[200px] justify-between bg-gray-50/70 border-gray-200">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Loading...</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </Button>
    );
  }

  if (sites.length === 0) {
    return (
      <Button variant="outline" disabled className="min-w-[200px] justify-between bg-gray-50/70 border-gray-200">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">No facilities</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[200px] justify-between bg-gray-50/70 border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-gray-700">{getDisplayText()}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 z-50 bg-white shadow-xl border border-gray-200 min-w-[320px] rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-600" />
                <h3 className="font-semibold text-sm text-gray-900">Select Facilities</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs h-7 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center space-x-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150"
                  onClick={() => handleSiteToggle(site.id)}
                >
                  <Checkbox
                    checked={selectedSites.includes(site.id)}
                    onCheckedChange={() => handleSiteToggle(site.id)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Badge className={`${site.color} border font-medium`} variant="secondary">
                    <Building2 className="h-3 w-3 mr-1" />
                    {site.name}
                  </Badge>
                </div>
              ))}
            </div>

            {selectedSites.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <span>Selected ({selectedSites.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSites.map((siteId) => {
                    const site = sites.find(s => s.id === siteId);
                    return (
                      <Badge
                        key={siteId}
                        className={`${site?.color} border font-medium text-xs`}
                        variant="secondary"
                      >
                        {site?.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSiteToggle(siteId);
                          }}
                          className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
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
