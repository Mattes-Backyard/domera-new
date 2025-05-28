
import { IntegrationCard } from "./IntegrationCard";

interface Integration {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: string;
  color: string;
}

interface IntegrationCategoryProps {
  category: string;
  items: Integration[];
  onConfigure: (name: string) => void;
}

export const IntegrationCategory = ({ category, items, onConfigure }: IntegrationCategoryProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{category}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((integration) => (
          <IntegrationCard
            key={integration.name}
            integration={integration}
            onConfigure={onConfigure}
          />
        ))}
      </div>
    </div>
  );
};
