
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  FileText, 
  MessageSquare,
  User,
  IdCard
} from "lucide-react";

interface ClientCardProps {
  clientId: string;
  onClose: () => void;
}

// Mock client data - in a real app this would come from an API
const getClientData = (clientId: string) => {
  const clients = {
    "john-smith": {
      id: "john-smith",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, ST 12345",
      personalId: "ID123456789",
      taxId: "TAX987654321",
      joinDate: "2024-01-15",
      units: ["A-101"],
      monthlyRate: 85,
      lastPayment: "2024-11-15",
      nextDue: "2024-12-15",
      accountBalance: 0,
      paymentMethod: "Credit Card **** 1234",
      emergencyContact: {
        name: "Jane Smith",
        phone: "(555) 987-6543",
        relationship: "Spouse"
      },
      notes: "Reliable tenant, always pays on time. Prefers email communication."
    },
    "sarah-johnson": {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Somewhere, ST 67890",
      personalId: "ID987654321",
      taxId: "TAX123456789",
      joinDate: "2024-05-20",
      units: ["A-103"],
      monthlyRate: 120,
      lastPayment: "2024-10-20",
      nextDue: "2024-12-20",
      accountBalance: 120,
      paymentMethod: "Bank Transfer",
      emergencyContact: {
        name: "Michael Johnson",
        phone: "(555) 876-5432",
        relationship: "Brother"
      },
      notes: "Reserved unit for December move-in. Deposit paid."
    },
    "mike-wilson": {
      id: "mike-wilson",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine St, Elsewhere, ST 54321",
      personalId: "ID456789123",
      taxId: "TAX654321987",
      joinDate: "2023-11-08",
      units: ["B-201", "C-301"],
      monthlyRate: 460,
      lastPayment: "2024-10-08",
      nextDue: "2024-12-08",
      accountBalance: -85,
      paymentMethod: "Credit Card **** 5678",
      emergencyContact: {
        name: "Lisa Wilson",
        phone: "(555) 765-4321",
        relationship: "Wife"
      },
      notes: "Business client with multiple units. Payment is overdue."
    }
  };

  return clients[clientId as keyof typeof clients] || null;
};

export const ClientCard = ({ clientId, onClose }: ClientCardProps) => {
  const client = getClientData(clientId);

  if (!client) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Client not found</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">
                {client.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <p className="text-gray-600">Client ID: {client.id}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{client.address}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {client.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IdCard className="h-4 w-4 text-gray-500" />
                  <span>ID: {client.personalId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>Tax ID: {client.taxId}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
            <div className="space-y-2">
              <p><strong>{client.emergencyContact.name}</strong> ({client.emergencyContact.relationship})</p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{client.emergencyContact.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rental Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Rental Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Units: </span>
                  {client.units.map((unit, index) => (
                    <Badge key={unit} variant="outline" className="ml-1">
                      {unit}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="font-medium">Monthly Rate: </span>
                  <span className="text-lg font-semibold">${client.monthlyRate}</span>
                </div>
                <div>
                  <span className="font-medium">Payment Method: </span>
                  <span>{client.paymentMethod}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Last Payment: </span>
                  <span>{client.lastPayment}</span>
                </div>
                <div>
                  <span className="font-medium">Next Due: </span>
                  <span>{client.nextDue}</span>
                </div>
                <div>
                  <span className="font-medium">Account Balance: </span>
                  <span className={`font-semibold ${getBalanceColor(client.accountBalance)}`}>
                    ${Math.abs(client.accountBalance)} 
                    {client.accountBalance < 0 ? " overdue" : client.accountBalance > 0 ? " credit" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{client.notes}</p>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Generate Invoice</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Send Message</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Process Payment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
