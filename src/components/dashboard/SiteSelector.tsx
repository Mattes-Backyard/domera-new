
import { Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSite } from "@/contexts/SiteContext";

export const SiteSelector = () => {
  const { currentSite, sites, switchSite } = useSite();

  return (
    <div className="flex items-center space-x-2">
      <Building2 className="h-4 w-4 text-gray-500" />
      <Select value={currentSite.id} onValueChange={switchSite}>
        <SelectTrigger className="w-auto min-w-[200px] border-0 shadow-none focus:ring-0">
          <SelectValue>
            <div className="flex flex-col text-left">
              <span className="font-medium">{currentSite.name}</span>
              <span className="text-xs text-gray-500">{currentSite.location}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              <div className="flex flex-col">
                <span className="font-medium">{site.name}</span>
                <span className="text-xs text-gray-500">{site.location}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
