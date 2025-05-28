
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AccountingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountingConfigDialog = ({ open, onOpenChange }: AccountingConfigDialogProps) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [syncFrequency, setSyncFrequency] = useState("");

  const handleSave = () => {
    console.log("Configuring Fortnox:", { clientId, clientSecret, syncFrequency });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Fortnox</DialogTitle>
          <DialogDescription>
            Connect your Fortnox account to sync financial data and automate bookkeeping.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="clientId">Client ID *</Label>
            <Input
              id="clientId"
              placeholder="Enter Fortnox Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientSecret">Client Secret *</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Enter Fortnox Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="syncFrequency">Sync Frequency *</Label>
            <Select value={syncFrequency} onValueChange={setSyncFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select sync frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="realtime">Real-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!clientId || !clientSecret || !syncFrequency}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
