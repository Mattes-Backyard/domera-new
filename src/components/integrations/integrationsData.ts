
import { MessageSquare, Calculator, CreditCard, Phone, Key, BarChart3 } from "lucide-react";

export const integrations = [
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
