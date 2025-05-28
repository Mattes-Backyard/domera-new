
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ChatbotConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationName: string;
}

export const ChatbotConfigDialog = ({ open, onOpenChange, integrationName }: ChatbotConfigDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [botId, setBotId] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleSave = () => {
    console.log(`Configuring ${integrationName}:`, { apiKey, botId, welcomeMessage });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {integrationName}</DialogTitle>
          <DialogDescription>
            Set up your AI chatbot to provide automated customer support on your website.
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
            <Label htmlFor="botId">Bot ID *</Label>
            <Input
              id="botId"
              placeholder="Enter bot identifier"
              value={botId}
              onChange={(e) => setBotId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="welcomeMessage">Welcome Message *</Label>
            <Input
              id="welcomeMessage"
              placeholder="Enter welcome message"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey || !botId || !welcomeMessage}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
