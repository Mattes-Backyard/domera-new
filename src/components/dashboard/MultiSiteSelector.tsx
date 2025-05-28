
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, MapPin, X } from "lucide-react";

interface MultiSiteSelectorProps {
  selectedSites: string[];
  onSitesChange: (sites: string[]) => void;
}

const sites = [
  { id: "helsingborg", name: "Helsingborg", color: "bg-blue-100 text-blue-800" },
  { id: "lund", name: "Lund", color: "bg-green-100 text-green-800" },
  { id: "malmö", name: "Malmö", color: "bg-purple-100 text-purple-800" },
];

export const MultiSiteSelector = ({ selectedSites, onSitesChange }: MultiSiteSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    onSitesChange([sites[0].id]); // Keep at least one site selected
  };

  const getDisplayText = () => {
    if (selectedSites.length === sites.length) {
      return "All Sites";
    }
    if (selectedSites.length === 1) {
      const site = sites.find(s => s.id === selectedSites[0]);
      return site?.name || "Select sites";
    }
    return `${selectedSites.length} Sites`;
  };

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
              <h3 className="font-medium text-sm">Select Sites</h3>
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
