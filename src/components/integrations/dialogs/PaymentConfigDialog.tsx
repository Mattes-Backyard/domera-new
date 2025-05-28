
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface PaymentConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentConfigDialog = ({ open, onOpenChange }: PaymentConfigDialogProps) => {
  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [currency, setCurrency] = useState("");

  const handleSave = () => {
    console.log("Configuring Stripe:", { publishableKey, secretKey, currency });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Stripe</DialogTitle>
          <DialogDescription>
            Set up Stripe payment processing for secure online transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="publishableKey">Publishable Key *</Label>
            <Input
              id="publishableKey"
              placeholder="pk_live_... or pk_test_..."
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secretKey">Secret Key *</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_live_... or sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currency">Default Currency *</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD - US Dollar</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="gbp">GBP - British Pound</SelectItem>
                <SelectItem value="sek">SEK - Swedish Krona</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!publishableKey || !secretKey || !currency}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
