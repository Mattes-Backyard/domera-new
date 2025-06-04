
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MessageSquare } from "lucide-react";
import { CustomerDetails } from "@/types/customer";

interface CustomerHeaderProps {
  customer: CustomerDetails;
  onBack: () => void;
}

export const CustomerHeader = ({ customer, onBack }: CustomerHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-600">{customer.email}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
};
