
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit3, Save, X } from "lucide-react";

interface BulkActionsSectionProps {
  selectedUnits: string[];
  bulkChanges: {
    status: string;
    rate: string;
    type: string;
  };
  onBulkChangesChange: (changes: { status: string; rate: string; type: string }) => void;
  onApplyChanges: () => void;
  onClearSelection: () => void;
}

export const BulkActionsSection = ({
  selectedUnits,
  bulkChanges,
  onBulkChangesChange,
  onApplyChanges,
  onClearSelection
}: BulkActionsSectionProps) => {
  const handleBulkChange = (key: string, value: string) => {
    onBulkChangesChange({ ...bulkChanges, [key]: value });
  };

  if (selectedUnits.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Bulk Actions ({selectedUnits.length} units selected)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Change Status</Label>
            <Select value={bulkChanges.status} onValueChange={(value) => handleBulkChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Change Rate ($)</Label>
            <Input
              type="number"
              placeholder="New rate"
              value={bulkChanges.rate}
              onChange={(e) => handleBulkChange('rate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Change Type</Label>
            <Select value={bulkChanges.type} onValueChange={(value) => handleBulkChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onApplyChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Apply Changes
          </Button>
          <Button variant="outline" onClick={onClearSelection}>
            <X className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
