
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Mail, Phone, MapPin, AlertCircle, Clock, CheckCircle2, Users } from "lucide-react";
import { DatabaseCustomer } from "@/types/customer";
import { useState } from "react";

interface CustomerTableViewProps {
  customers: DatabaseCustomer[];
  onViewDetails: (customer: DatabaseCustomer) => void;
  selectedCustomerId: string | null;
  onBulkAction?: (action: string, customerIds: string[]) => void;
}

export const CustomerTableView = ({
  customers,
  onViewDetails,
  selectedCustomerId,
  onBulkAction
}: CustomerTableViewProps) => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'inactive':
        return <AlertCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getBalanceStatus = (balance: number | null | undefined) => {
    if (!balance || balance <= 0) return 'current';
    if (balance > 0 && balance <= 100) return 'overdue';
    return 'critical';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const getDaysAgo = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onBulkAction?.('send_reminder', selectedCustomers)}
              >
                Send Reminder
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onBulkAction?.('export', selectedCustomers)}
              >
                Export
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedCustomers([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCustomers.length === customers.length && customers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Contact Info</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Balance</TableHead>
              <TableHead className="font-semibold">Join Date</TableHead>
              <TableHead className="font-semibold">Last Activity</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => {
              const balanceStatus = getBalanceStatus(customer.balance);
              const joinDaysAgo = getDaysAgo(customer.join_date);
              const isSelected = selectedCustomers.includes(customer.id);
              
              return (
                <TableRow 
                  key={customer.id}
                  className={`
                    ${selectedCustomerId === customer.id ? 'bg-blue-50 border-blue-200' : ''} 
                    ${isSelected ? 'bg-gray-50' : ''} 
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {customer.first_name} {customer.last_name}
                      </div>
                      {customer.emergency_contact_name && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Emergency: {customer.emergency_contact_name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-[180px]" title={customer.email}>
                            {customer.email}
                          </span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {customer.address && (
                        <div className="flex items-start gap-1">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{customer.address}</div>
                            {(customer.city || customer.state || customer.zip_code) && (
                              <div className="text-gray-500">
                                {[customer.city, customer.state, customer.zip_code]
                                  .filter(Boolean)
                                  .join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${getStatusColor(customer.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(customer.status)}
                      {customer.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-right">
                      <div className={`font-medium ${
                        balanceStatus === 'critical' ? 'text-red-600' : 
                        balanceStatus === 'overdue' ? 'text-orange-600' : 
                        'text-gray-900'
                      }`}>
                        {formatCurrency(customer.balance)}
                      </div>
                      {balanceStatus !== 'current' && (
                        <div className="text-xs text-gray-500">
                          {balanceStatus === 'critical' ? 'Critical' : 'Overdue'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{formatDate(customer.join_date)}</div>
                      {joinDaysAgo !== null && (
                        <div className="text-gray-500 text-xs">
                          {joinDaysAgo === 0 ? 'Today' : 
                           joinDaysAgo === 1 ? '1 day ago' : 
                           `${joinDaysAgo} days ago`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      <div>Last payment:</div>
                      <div className="text-xs">2 days ago</div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(customer)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-2">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500 font-medium">No customers found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or add new customers</p>
        </div>
      )}
    </div>
  );
};
