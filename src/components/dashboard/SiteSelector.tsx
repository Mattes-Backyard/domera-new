
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

  const truncateName = (name: string) => {
    return name.length > 20 ? name.substring(0, 20) + "..." : name;
  };

  return (
    <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-slate-200">
      <div className="p-2 rounded-full bg-blue-50">
        <Building2 className="h-4 w-4 text-blue-600" />
      </div>
      <Select value={currentSite.id} onValueChange={switchSite}>
        <SelectTrigger className="w-auto min-w-[200px] border-0 shadow-none focus:ring-0 bg-transparent">
          <SelectValue>
            <div className="flex flex-col text-left">
              <span className="font-medium text-slate-800">{currentSite.name}</span>
              <span className="text-xs text-slate-500">{currentSite.location}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 shadow-lg">
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id} className="hover:bg-blue-50 focus:bg-blue-50">
              <div className="flex flex-col">
                <span className="font-medium text-slate-800">{site.name}</span>
                <span className="text-xs text-slate-500">{site.location}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
