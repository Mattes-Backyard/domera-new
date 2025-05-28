
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface SmartEntryConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationName: string;
}

export const SmartEntryConfigDialog = ({ open, onOpenChange, integrationName }: SmartEntryConfigDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [accessMode, setAccessMode] = useState("");

  const handleSave = () => {
    console.log(`Configuring ${integrationName}:`, { apiKey, facilityId, accessMode });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {integrationName}</DialogTitle>
          <DialogDescription>
            Set up your {integrationName} integration to enable automated customer access.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facilityId">Facility ID *</Label>
            <Input
              id="facilityId"
              placeholder="Enter facility identifier"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accessMode">Access Mode *</Label>
            <Select value={accessMode} onValueChange={setAccessMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select access mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pin">PIN Code</SelectItem>
                <SelectItem value="app">Mobile App</SelectItem>
                <SelectItem value="fob">Key Fob</SelectItem>
                <SelectItem value="plate">License Plate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey || !facilityId || !accessMode}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
