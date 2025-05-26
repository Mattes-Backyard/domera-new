
import { Package } from "lucide-react";

interface EmptyUnitsStateProps {
  searchQuery: string;
}

export const EmptyUnitsState = ({ searchQuery }: EmptyUnitsStateProps) => {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No units found</h3>
      <p className="text-gray-600">Try adjusting your search terms</p>
    </div>
  );
};
