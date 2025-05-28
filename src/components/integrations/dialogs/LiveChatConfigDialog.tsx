
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface LiveChatConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationName: string;
}

export const LiveChatConfigDialog = ({ open, onOpenChange, integrationName }: LiveChatConfigDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [widgetId, setWidgetId] = useState("");
  const [availability, setAvailability] = useState("");

  const handleSave = () => {
    console.log(`Configuring ${integrationName}:`, { apiKey, widgetId, availability });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {integrationName}</DialogTitle>
          <DialogDescription>
            Set up live chat to respond to website visitors and customers in real-time.
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
            <Label htmlFor="widgetId">Widget ID *</Label>
            <Input
              id="widgetId"
              placeholder="Enter widget identifier"
              value={widgetId}
              onChange={(e) => setWidgetId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availability">Availability *</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24/7">24/7 Available</SelectItem>
                <SelectItem value="business">Business Hours</SelectItem>
                <SelectItem value="custom">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey || !widgetId || !availability}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
