import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Eye, DollarSign, FileText, Calendar, CreditCard } from "lucide-react";
import { PaymentProcessor } from "@/components/payments/PaymentProcessor";
import { CreateInvoiceDialog } from "@/components/billing/CreateInvoiceDialog";
import { useInvoices, type Invoice } from "@/hooks/useInvoices";
import { useRealtimeSupabaseData } from "@/hooks/useRealtimeSupabaseData";
import { toast } from "sonner";

export const BillingView = () => {
  const { invoices, loading, updateInvoiceStatus, downloadInvoicePDF, generateInvoicePDF, previewInvoicePDF, createInvoice } = useInvoices();
  const { customers } = useRealtimeSupabaseData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || "Unknown Customer";
  };

  const filteredInvoices = invoices.filter(invoice => {
    const customerName = getCustomerName(invoice.customer_id);
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customer_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    const matchesAmount = amountFilter === "all" || 
                         (amountFilter === "under100" && invoice.total_amount < 100) ||
                         (amountFilter === "100to300" && invoice.total_amount >= 100 && invoice.total_amount <= 300) ||
                         (amountFilter === "over300" && invoice.total_amount > 300);
    
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "thisMonth" && new Date(invoice.issue_date).getMonth() === new Date().getMonth()) ||
                       (dateFilter === "lastMonth" && new Date(invoice.issue_date).getMonth() === new Date().getMonth() - 1) ||
                       (dateFilter === "overdue" && new Date(invoice.due_date) < new Date() && invoice.status !== "paid");
    
    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
  });

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === "paid").reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === "pending").reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === "overdue").reduce((sum, invoice) => sum + invoice.total_amount, 0);

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentProcessor(true);
  };

  const handlePaymentComplete = async (paymentData: any) => {
    if (selectedInvoice) {
      const success = await updateInvoiceStatus(selectedInvoice.id, 'paid');
      if (success) {
        toast.success("Payment processed successfully");
      } else {
        toast.error("Failed to update invoice status");
      }
    }
    setShowPaymentProcessor(false);
    setSelectedInvoice(null);
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    return await createInvoice(invoiceData);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice);
      toast.success("Invoice PDF downloaded");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const handleGeneratePDF = async (invoice: Invoice) => {
    try {
      await generateInvoicePDF(invoice);
      toast.success("Invoice PDF generated");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const handlePreviewPDF = async (invoice: Invoice) => {
    try {
      await previewInvoicePDF(invoice);
      toast.success("Opening invoice preview");
    } catch (error) {
      toast.error("Failed to preview PDF");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showPaymentProcessor && selectedInvoice ? (
        <PaymentProcessor
          amount={selectedInvoice.total_amount}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => {
            setShowPaymentProcessor(false);
            setSelectedInvoice(null);
          }}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
              <p className="text-gray-600">
                Manage invoices and billing ({filteredInvoices.length} of {invoices.length} invoices)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <CreateInvoiceDialog onCreateInvoice={handleCreateInvoice} />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">€{totalAmount.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paid</p>
                    <p className="text-2xl font-bold text-green-600">€{paidAmount.toFixed(2)}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">€{pendingAmount.toFixed(2)}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">€{overdueAmount.toFixed(2)}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All amounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All amounts</SelectItem>
                  <SelectItem value="under100">Under €100</SelectItem>
                  <SelectItem value="100to300">€100 - €300</SelectItem>
                  <SelectItem value="over300">Over €300</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setAmountFilter("all");
                  setDateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>VAT</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{invoice.invoice_number}</div>
                        <div className="text-sm text-gray-500">ID: {invoice.id.slice(0, 8)}...</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium text-gray-900">{getCustomerName(invoice.customer_id)}</div>
                      <div className="text-sm text-gray-500">ID: {invoice.customer_id.slice(0, 8)}...</div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <span className="font-semibold text-gray-900">€{invoice.total_amount.toFixed(2)}</span>
                        <div className="text-sm text-gray-500">Subtotal: €{invoice.subtotal.toFixed(2)}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {invoice.issue_date}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {invoice.due_date}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {invoice.vat_rate}% (€{invoice.vat_amount.toFixed(2)})
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handlePreviewPDF(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {(invoice.status === "pending" || invoice.status === "sent") && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePayInvoice(invoice)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {invoices.length === 0 ? "No invoices found. Create your first invoice!" : "No invoices found matching your criteria."}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
