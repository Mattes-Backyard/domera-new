
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Key, Smartphone, CreditCard, Shield } from "lucide-react";

interface AccessMethod {
  id: string;
  type: "pin" | "card" | "mobile" | "biometric";
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const accessMethods: AccessMethod[] = [
  {
    id: "pin",
    type: "pin",
    label: "PIN Code",
    icon: Key,
    description: "4-6 digit access code"
  },
  {
    id: "card",
    type: "card", 
    label: "Access Card",
    icon: CreditCard,
    description: "RFID or magnetic stripe card"
  },
  {
    id: "mobile",
    type: "mobile",
    label: "Mobile App",
    icon: Smartphone,
    description: "Smartphone-based access"
  },
  {
    id: "biometric",
    type: "biometric",
    label: "Biometric",
    icon: Shield,
    description: "Fingerprint or facial recognition"
  }
];

interface AccessControlPanelProps {
  tenantId?: string;
  unitId?: string;
  onAccessMethodAssigned: (method: string, code: string) => void;
}

export const AccessControlPanel = ({ tenantId, unitId, onAccessMethodAssigned }: AccessControlPanelProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [accessCode, setAccessCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAccessCode = (method: string) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let code = "";
      switch (method) {
        case "pin":
          code = Math.floor(1000 + Math.random() * 9000).toString();
          break;
        case "card":
          code = `CARD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
          break;
        case "mobile":
          code = `MOB-${Math.random().toString(36).substr(2, 10).toUpperCase()}`;
          break;
        case "biometric":
          code = `BIO-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
          break;
      }
      setAccessCode(code);
      setIsGenerating(false);
    }, 1000);
  };

  const handleAssignAccess = () => {
    if (selectedMethod && accessCode) {
      onAccessMethodAssigned(selectedMethod, accessCode);
      setSelectedMethod("");
      setAccessCode("");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Control Management</h1>
        <p className="text-gray-600">Configure secure facility entry methods</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.type)}
                >
                  <div className="flex items-center space-x-3">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                    {selectedMethod === method.type && (
                      <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate Access Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMethod ? (
              <>
                <div className="text-sm text-gray-600">
                  Selected method: <span className="font-medium">{selectedMethod}</span>
                </div>
                
                <Button 
                  onClick={() => generateAccessCode(selectedMethod)}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Access Code"}
                </Button>

                {accessCode && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Generated Code:</div>
                    <div className="font-mono text-lg font-bold">{accessCode}</div>
                  </div>
                )}

                <Button 
                  onClick={handleAssignAccess}
                  disabled={!accessCode}
                  variant="outline"
                  className="w-full"
                >
                  Assign Access
                </Button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select an access method to generate a code
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
