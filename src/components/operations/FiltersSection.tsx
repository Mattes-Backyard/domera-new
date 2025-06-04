
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface FiltersSectionProps {
  filters: {
    status: string;
    type: string;
    size: string;
    site: string;
  };
  onFiltersChange: (filters: { status: string; type: string; size: string; site: string }) => void;
}

export const FiltersSection = ({ filters, onFiltersChange }: FiltersSectionProps) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Large">Large</SelectItem>
              <SelectItem value="Extra Large">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <Select value={filters.size} onValueChange={(value) => handleFilterChange('size', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              <SelectItem value="5x5">5x5</SelectItem>
              <SelectItem value="5x10">5x10</SelectItem>
              <SelectItem value="8x8">8x8</SelectItem>
              <SelectItem value="8x10">8x10</SelectItem>
              <SelectItem value="10x10">10x10</SelectItem>
              <SelectItem value="10x15">10x15</SelectItem>
              <SelectItem value="10x20">10x20</SelectItem>
              <SelectItem value="12x12">12x12</SelectItem>
              <SelectItem value="12x15">12x15</SelectItem>
              <SelectItem value="12x20">12x20</SelectItem>
              <SelectItem value="15x20">15x20</SelectItem>
              <SelectItem value="15x25">15x25</SelectItem>
              <SelectItem value="20x20">20x20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Facility</Label>
          <Select value={filters.site} onValueChange={(value) => handleFilterChange('site', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All facilities</SelectItem>
              <SelectItem value="helsingborg">Helsingborg</SelectItem>
              <SelectItem value="lund">Lund</SelectItem>
              <SelectItem value="malmö">Malmö</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
