import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calculator } from "lucide-react";
import { useRealtimeSupabaseData } from "@/hooks/useRealtimeSupabaseData";
import { CreateInvoiceData } from "@/hooks/useInvoices";
import { toast } from "sonner";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface CreateInvoiceDialogProps {
  onCreateInvoice: (data: CreateInvoiceData) => Promise<any>;
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    SEK: 'kr'
  };
  return symbols[currency] || currency;
};

export const CreateInvoiceDialog = ({ onCreateInvoice }: CreateInvoiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const { customers, unitRentals, units } = useRealtimeSupabaseData();
  const { companyInfo } = useCompanySettings();
  
  const [formData, setFormData] = useState({
    customer_id: "",
    unit_rental_id: "",
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtotal: 0,
    vat_rate: 25.00,
    description: "Storage unit rental",
    status: 'draft' as const
  });

  const currency = companyInfo?.currency || 'EUR';
  const currencySymbol = getCurrencySymbol(currency);
  const vatAmount = (formData.subtotal * formData.vat_rate) / 100;
  const totalAmount = formData.subtotal + vatAmount;

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}-${timestamp}`;
  };

  const getCustomerUnits = () => {
    if (!formData.customer_id) return [];
    
    // Find active unit rentals for the selected customer
    const customerRentals = unitRentals.filter(rental => 
      rental.customer_id === formData.customer_id && 
      rental.is_active === true
    );
    
    // Get unit details for each rental
    return customerRentals.map(rental => {
      const unit = units.find(u => u.id === rental.unit_id);
      return {
        ...rental,
        unit_id_display: unit ? unit.unit_number : `Unit ${rental.unit_id?.slice(0, 8)}...`,
        unit_details: unit
      };
    });
  };

  const handleUnitChange = (rentalId: string) => {
    const customerUnits = getCustomerUnits();
    const selectedRental = customerUnits.find(r => r.id === rentalId);
    
    if (selectedRental) {
      const unitId = selectedRental.unit_id_display || 'Storage unit';
      setFormData(prev => ({ 
        ...prev, 
        unit_rental_id: rentalId,
        subtotal: selectedRental.monthly_rate || 0,
        description: `${unitId} rental`
      }));
    }
  };

  const handleCustomerChange = (customerId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      customer_id: customerId,
      unit_rental_id: "", // Reset unit selection when customer changes
      subtotal: 0,
      description: "Storage unit rental"
    }));
  };

  const getCustomerName = (customer: any) => {
    if (customer.name) return customer.name;
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    }
    return `Customer ${customer.id?.slice(0, 8)}...`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || !formData.unit_rental_id || formData.subtotal <= 0) {
      toast.error("Please fill in all required fields including unit selection");
      return;
    }

    try {
      const invoiceData: CreateInvoiceData = {
        invoice_number: generateInvoiceNumber(),
        customer_id: formData.customer_id,
        unit_rental_id: formData.unit_rental_id,
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        subtotal: formData.subtotal,
        vat_rate: formData.vat_rate,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        status: formData.status,
        description: formData.description,
        currency: currency
      };

      const result = await onCreateInvoice(invoiceData);
      if (result) {
        toast.success("Invoice created successfully");
        setOpen(false);
        setFormData({
          customer_id: "",
          unit_rental_id: "",
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subtotal: 0,
          vat_rate: 25.00,
          description: "Storage unit rental",
          status: 'draft' as const
        });
      } else {
        toast.error("Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const customerUnits = getCustomerUnits();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for a customer's unit rental.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Customer *</Label>
              <Select 
                value={formData.customer_id} 
                onValueChange={handleCustomerChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem 
                      key={customer.id} 
                      value={customer.id}
                    >
                      {getCustomerName(customer)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select 
                value={formData.unit_rental_id} 
                onValueChange={handleUnitChange}
                disabled={!formData.customer_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.customer_id ? "Select customer first" : "Select unit rental"} />
                </SelectTrigger>
                <SelectContent>
                  {customerUnits.length > 0 ? (
                    customerUnits.map((rental) => (
                      <SelectItem 
                        key={rental.id} 
                        value={rental.id}
                      >
                        {rental.unit_id_display} - {currencySymbol}{rental.monthly_rate || 0}/month
                      </SelectItem>
                    ))
                  ) : (
                    formData.customer_id && (
                      <SelectItem value="no-rentals" disabled>
                        No active rentals found for this customer
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {formData.customer_id && customerUnits.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  This customer has no active unit rentals
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="issue_date">Issue Date *</Label>
              <Input 
                type="date" 
                value={formData.issue_date}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input 
                type="date" 
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="subtotal">Subtotal ({currencySymbol}) *</Label>
              <Input 
                type="number" 
                step="0.01" 
                min="0"
                value={formData.subtotal}
                onChange={(e) => setFormData(prev => ({ ...prev, subtotal: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="vat_rate">VAT Rate (%) *</Label>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
                max="100"
                value={formData.vat_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, vat_rate: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              placeholder="Invoice description..."
              className="min-h-[80px]"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          {/* Calculation Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4" />
              <span className="font-medium">Invoice Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Subtotal:</span>
                <div className="font-medium">{currencySymbol}{formData.subtotal.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-600">VAT ({formData.vat_rate}%):</span>
                <div className="font-medium">{currencySymbol}{vatAmount.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <div className="font-bold text-lg">{currencySymbol}{totalAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
