
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User, MapPin } from "lucide-react";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  status: string;
}

interface SearchResultsProps {
  searchQuery: string;
  searchResults: {
    units: Unit[];
    customers: Customer[];
  };
  onResultClick: (type: 'unit' | 'customer', id: string) => void;
}

export const SearchResults = ({ searchQuery, searchResults, onResultClick }: SearchResultsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "former":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const hasResults = searchResults.units.length > 0 || searchResults.customers.length > 0;

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 bg-white shadow-lg border border-gray-200 max-h-96 overflow-y-auto min-w-[600px]">
      {!hasResults && searchQuery.trim() ? (
        <div className="p-4 text-center text-gray-500">
          <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No results found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="p-2">
          {searchResults.units.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <Package className="h-3 w-3" />
                Units ({searchResults.units.length})
              </div>
              {searchResults.units.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => onResultClick('unit', unit.id)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-md border-b border-gray-100 last:border-b-0 min-h-[60px]"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="font-medium text-gray-900 whitespace-nowrap">{unit.id}</div>
                    <Badge className={getStatusColor(unit.status)} variant="secondary">
                      {unit.status}
                    </Badge>
                    <span className="text-sm text-gray-600 whitespace-nowrap">{unit.size} • {unit.type}</span>
                    {unit.tenant && (
                      <span className="text-sm text-blue-600 truncate max-w-[200px]" title={unit.tenant}>
                        {unit.tenant}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900 whitespace-nowrap ml-3">${unit.rate}/month</div>
                </div>
              ))}
            </div>
          )}

          {searchResults.customers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <User className="h-3 w-3" />
                Customers ({searchResults.customers.length})
              </div>
              {searchResults.customers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => onResultClick('customer', customer.id)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-md border-b border-gray-100 last:border-b-0 min-h-[60px]"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate max-w-[150px]" title={customer.name}>
                      {customer.name}
                    </div>
                    <Badge className={getStatusColor(customer.status)} variant="secondary">
                      {customer.status}
                    </Badge>
                    <span className="text-sm text-gray-600 truncate max-w-[200px]" title={customer.email}>
                      {customer.email}
                    </span>
                    {customer.units.length > 0 && (
                      <div className="flex items-center space-x-1 text-sm text-blue-600">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-[150px]" title={customer.units.join(", ")}>
                          {customer.units.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
