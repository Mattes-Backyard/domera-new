
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Calculator } from "lucide-react";
import { useRealtimeSupabaseData } from "@/hooks/useRealtimeSupabaseData";
import { CreateInvoiceData } from "@/hooks/useInvoices";
import { toast } from "sonner";

interface CreateInvoiceDialogProps {
  onCreateInvoice: (data: CreateInvoiceData) => Promise<any>;
}

interface InvoiceFormData {
  customer_id: string;
  unit_rental_id?: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  vat_rate: number;
  description: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
}

export const CreateInvoiceDialog = ({ onCreateInvoice }: CreateInvoiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const { customers, unitRentals } = useRealtimeSupabaseData();
  const [vatAmount, setVatAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const form = useForm<InvoiceFormData>({
    defaultValues: {
      customer_id: "",
      unit_rental_id: "",
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: 0,
      vat_rate: 25.00,
      description: "Storage unit rental",
      status: 'draft'
    }
  });

  const watchedSubtotal = form.watch("subtotal");
  const watchedVatRate = form.watch("vat_rate");
  const watchedCustomerId = form.watch("customer_id");

  useEffect(() => {
    const subtotal = Number(watchedSubtotal) || 0;
    const vatRate = Number(watchedVatRate) || 0;
    const calculatedVatAmount = (subtotal * vatRate) / 100;
    const calculatedTotal = subtotal + calculatedVatAmount;
    
    setVatAmount(calculatedVatAmount);
    setTotalAmount(calculatedTotal);
  }, [watchedSubtotal, watchedVatRate]);

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}-${timestamp}`;
  };

  const getCustomerUnitRentals = () => {
    if (!watchedCustomerId) return [];
    return unitRentals.filter(rental => rental.customer_id === watchedCustomerId && rental.is_active);
  };

  const handleUnitRentalChange = (unitRentalId: string) => {
    const rental = unitRentals.find(r => r.id === unitRentalId);
    if (rental) {
      form.setValue("subtotal", rental.monthly_rate);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const invoiceData: CreateInvoiceData = {
        invoice_number: generateInvoiceNumber(),
        customer_id: data.customer_id,
        unit_rental_id: data.unit_rental_id || undefined,
        issue_date: data.issue_date,
        due_date: data.due_date,
        subtotal: data.subtotal,
        vat_rate: data.vat_rate,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        status: data.status
      };

      const result = await onCreateInvoice(invoiceData);
      if (result) {
        toast.success("Invoice created successfully");
        setOpen(false);
        form.reset();
      } else {
        toast.error("Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

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
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_id"
                rules={{ required: "Customer is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name || `Customer ${customer.id.slice(0, 8)}...`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_rental_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Rental (Optional)</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleUnitRentalChange(value);
                      }} 
                      defaultValue={field.value}
                      disabled={!watchedCustomerId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit rental" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getCustomerUnitRentals().map((rental) => (
                          <SelectItem key={rental.id} value={rental.id}>
                            Unit Rental - €{rental.monthly_rate}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issue_date"
                rules={{ required: "Issue date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                rules={{ required: "Due date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtotal"
                rules={{ 
                  required: "Subtotal is required",
                  min: { value: 0.01, message: "Subtotal must be greater than 0" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtotal (€) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vat_rate"
                rules={{ 
                  required: "VAT rate is required",
                  min: { value: 0, message: "VAT rate cannot be negative" },
                  max: { value: 100, message: "VAT rate cannot exceed 100%" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Rate (%) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Invoice description..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calculation Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-4 w-4" />
                <span className="font-medium">Invoice Summary</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subtotal:</span>
                  <div className="font-medium">€{watchedSubtotal?.toFixed(2) || '0.00'}</div>
                </div>
                <div>
                  <span className="text-gray-600">VAT ({watchedVatRate}%):</span>
                  <div className="font-medium">€{vatAmount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <div className="font-bold text-lg">€{totalAmount.toFixed(2)}</div>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
