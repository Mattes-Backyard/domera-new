
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Integration {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: string;
  color: string;
}

interface IntegrationCardProps {
  integration: Integration;
  onConfigure: (name: string) => void;
}

export const IntegrationCard = ({ integration, onConfigure }: IntegrationCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
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
          onClick={() => onConfigure(integration.name)}
        >
          Configure
        </Button>
      </CardContent>
    </Card>
  );
};
