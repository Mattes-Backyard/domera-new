
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone } from "lucide-react";
import { DatabaseCustomer } from "@/types/customer";

interface CustomerTableViewProps {
  customers: DatabaseCustomer[];
  onViewDetails: (customer: DatabaseCustomer) => void;
  selectedCustomerId: string | null;
}

export const CustomerTableView = ({
  customers,
  onViewDetails,
  selectedCustomerId
}: CustomerTableViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow 
              key={customer.id}
              className={selectedCustomerId === customer.id ? 'bg-blue-50' : ''}
            >
              <TableCell>
                <div>
                  <div className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </div>
                  {customer.emergency_contact_name && (
                    <div className="text-sm text-gray-500">
                      Emergency: {customer.emergency_contact_name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {customer.email && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {customer.address && <div>{customer.address}</div>}
                  {(customer.city || customer.state || customer.zip_code) && (
                    <div className="text-gray-500">
                      {[customer.city, customer.state, customer.zip_code]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={customer.balance && customer.balance > 0 ? 'text-red-600 font-medium' : ''}>
                  {formatCurrency(customer.balance)}
                </span>
              </TableCell>
              <TableCell>
                {customer.join_date ? new Date(customer.join_date).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(customer)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
