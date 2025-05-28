
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface SpaceCalculatorConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SpaceCalculatorConfigDialog = ({ open, onOpenChange }: SpaceCalculatorConfigDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [unitSystem, setUnitSystem] = useState("");
  const [embedLocation, setEmbedLocation] = useState("");

  const handleSave = () => {
    console.log("Configuring Calcumate:", { apiKey, unitSystem, embedLocation });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Calcumate</DialogTitle>
          <DialogDescription>
            Set up the 3D space calculator to help customers determine storage needs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter Calcumate API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unitSystem">Unit System *</Label>
            <Select value={unitSystem} onValueChange={setUnitSystem}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (m³)</SelectItem>
                <SelectItem value="imperial">Imperial (ft³)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="embedLocation">Embed Location *</Label>
            <Select value={embedLocation} onValueChange={setEmbedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select embed location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homepage">Homepage</SelectItem>
                <SelectItem value="pricing">Pricing Page</SelectItem>
                <SelectItem value="booking">Booking Flow</SelectItem>
                <SelectItem value="all">All Pages</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey || !unitSystem || !embedLocation}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
