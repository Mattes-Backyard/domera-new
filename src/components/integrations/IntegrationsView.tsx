import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calculator, CreditCard, Phone, Key, BarChart3 } from "lucide-react";
import { useState } from "react";
import { SmartEntryConfigDialog } from "./dialogs/SmartEntryConfigDialog";
import { AccountingConfigDialog } from "./dialogs/AccountingConfigDialog";
import { ChatbotConfigDialog } from "./dialogs/ChatbotConfigDialog";
import { SpaceCalculatorConfigDialog } from "./dialogs/SpaceCalculatorConfigDialog";
import { PaymentConfigDialog } from "./dialogs/PaymentConfigDialog";
import { LiveChatConfigDialog } from "./dialogs/LiveChatConfigDialog";

const integrations = [
  {
    category: "Smart Entry",
    items: [
      {
        name: "BearBox",
        description: "Enable automated customer access to your facility by app, pin code or vehicle number plate.",
        icon: Key,
        status: "available",
        color: "bg-blue-700"
      },
      {
        name: "Nokē Smart Entry",
        description: "Enable smart access by mobile app or fob with the Noke access control system.",
        icon: Key,
        status: "available",
        color: "bg-blue-600"
      },
      {
        name: "OpenTech Alliance",
        description: "Simplify access to your self storage facility – grant customers instant entry on move-in via secure pin code.",
        icon: Key,
        status: "available",
        color: "bg-orange-500"
      },
      {
        name: "Paxton Net2",
        description: "Integrate Stora with Paxton's Net2 entry system to automate facility access via keypad.",
        icon: Key,
        status: "available",
        color: "bg-green-600"
      },
      {
        name: "PTI Security Systems",
        description: "Use PTI Storlogix access control system to facility unstaffed move-ins via pin code.",
        icon: Key,
        status: "available",
        color: "bg-yellow-600"
      },
      {
        name: "sedisto",
        description: "sedisto automates processes and digitizes access control, covering everything from the gate to individual storage units.",
        icon: Key,
        status: "available",
        color: "bg-gray-700"
      },
      {
        name: "Sensorberg",
        description: "Give your customers automated access via the Sensorberg One Access mobile app.",
        icon: Key,
        status: "available",
        color: "bg-blue-500"
      },
      {
        name: "SpiderDoor",
        description: "Offer tenants automated gate access by pin code.",
        icon: Key,
        status: "available",
        color: "bg-gray-900"
      }
    ]
  },
  {
    category: "Accounting",
    items: [
      {
        name: "Fortnox",
        description: "Simplify bookkeeping and financial reporting with Fortnox's cloud-based accounting.",
        icon: BarChart3,
        status: "available",
        color: "bg-green-500"
      }
    ]
  },
  {
    category: "AI Chatbot",
    items: [
      {
        name: "Chatbase",
        description: "Easily create and embed a custom AI chatbot on your self storage website.",
        icon: MessageSquare,
        status: "available",
        color: "bg-gray-900"
      },
      {
        name: "Intercom",
        description: "A highly customisable, integrated live chat and AI chatbot that can be used to respond on your website.",
        icon: MessageSquare,
        status: "available",
        color: "bg-blue-600"
      }
    ]
  },
  {
    category: "Space Calculator",
    items: [
      {
        name: "Calcumate",
        description: "Show your customers how much storage space they need with Calcumate's 3D tool.",
        icon: Calculator,
        status: "available",
        color: "bg-blue-500"
      }
    ]
  },
  {
    category: "Payment Processing",
    items: [
      {
        name: "Stripe",
        description: "Streamline your payment process with secure online transactions through Stripe.",
        icon: CreditCard,
        status: "available",
        color: "bg-purple-600"
      }
    ]
  },
  {
    category: "Live Chat",
    items: [
      {
        name: "HubSpot",
        description: "Add Hubspot's free live chat to your website to respond to website visitors and logged-in customers.",
        icon: Phone,
        status: "available",
        color: "bg-orange-600"
      },
      {
        name: "Intercom",
        description: "A highly customisable, integrated live chat and AI chatbot that can be used to respond on your website.",
        icon: Phone,
        status: "available",
        color: "bg-blue-600"
      }
    ]
  }
];

export const IntegrationsView = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleConfigure = (integrationName: string) => {
    console.log(`Opening configuration for ${integrationName}`);
    setOpenDialog(integrationName);
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const getDialogComponent = () => {
    if (!openDialog) return null;

    // Smart Entry integrations
    const smartEntryIntegrations = ["BearBox", "Nokē Smart Entry", "OpenTech Alliance", "Paxton Net2", "PTI Security Systems", "sedisto", "Sensorberg", "SpiderDoor"];
    if (smartEntryIntegrations.includes(openDialog)) {
      return (
        <SmartEntryConfigDialog
          open={true}
          onOpenChange={closeDialog}
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
          onOpenChange={closeDialog}
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
          onOpenChange={closeDialog}
          integrationName={openDialog}
        />
      );
    }

    switch (openDialog) {
      case "Fortnox":
        return <AccountingConfigDialog open={true} onOpenChange={closeDialog} />;
      case "Calcumate":
        return <SpaceCalculatorConfigDialog open={true} onOpenChange={closeDialog} />;
      case "Stripe":
        return <PaymentConfigDialog open={true} onOpenChange={closeDialog} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
          <p className="text-gray-600">Connect your storage facility with powerful third-party tools and services.</p>
        </div>

        {integrations.map((category) => (
          <div key={category.category} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((integration) => (
                <Card key={integration.name} className="hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center`}>
                          <integration.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                      {integration.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-auto"
                      onClick={() => handleConfigure(integration.name)}
                    >
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {getDialogComponent()}
    </div>
  );
};
