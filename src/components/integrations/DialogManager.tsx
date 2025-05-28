
import { SmartEntryConfigDialog } from "./dialogs/SmartEntryConfigDialog";
import { AccountingConfigDialog } from "./dialogs/AccountingConfigDialog";
import { ChatbotConfigDialog } from "./dialogs/ChatbotConfigDialog";
import { SpaceCalculatorConfigDialog } from "./dialogs/SpaceCalculatorConfigDialog";
import { PaymentConfigDialog } from "./dialogs/PaymentConfigDialog";
import { LiveChatConfigDialog } from "./dialogs/LiveChatConfigDialog";

interface DialogManagerProps {
  openDialog: string | null;
  onClose: () => void;
}

export const DialogManager = ({ openDialog, onClose }: DialogManagerProps) => {
  if (!openDialog) return null;

  // Smart Entry integrations
  const smartEntryIntegrations = ["BearBox", "Nokē Smart Entry", "OpenTech Alliance", "Paxton Net2", "PTI Security Systems", "sedisto", "Sensorberg", "SpiderDoor"];
  if (smartEntryIntegrations.includes(openDialog)) {
    return (
      <SmartEntryConfigDialog
        open={true}
        onOpenChange={onClose}
        integrationName={openDialog}
      />
    );
  }

  // AI Chatbot integrations
  const chatbotIntegrations = ["Chatbase", "Intercom"];
  if (chatbotIntegrations.includes(openDialog)) {
    return (
      <ChatbotConfigDialog
        open={true}
        onOpenChange={onClose}
        integrationName={openDialog}
      />
    );
  }

  // Live Chat integrations (HubSpot and Intercom for live chat)
  const liveChatIntegrations = ["HubSpot"];
  if (liveChatIntegrations.includes(openDialog) || (openDialog === "Intercom" && openDialog.includes("Live"))) {
    return (
      <LiveChatConfigDialog
        open={true}
        onOpenChange={onClose}
        integrationName={openDialog}
      />
    );
  }

  switch (openDialog) {
    case "Fortnox":
      return <AccountingConfigDialog open={true} onOpenChange={onClose} />;
    case "Calcumate":
      return <SpaceCalculatorConfigDialog open={true} onOpenChange={onClose} />;
    case "Stripe":
      return <PaymentConfigDialog open={true} onOpenChange={onClose} />;
    default:
      return null;
  }
};
