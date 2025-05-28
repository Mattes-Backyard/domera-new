
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Eye, DollarSign, FileText, Calendar } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issueDate: string;
  dueDate: string;
  unitIds: string[];
  description: string;
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2024-001",
    customerId: "C001",
    customerName: "John Smith",
    amount: 185.00,
    status: "paid",
    issueDate: "2024-01-01",
    dueDate: "2024-01-31",
    unitIds: ["A-101"],
    description: "Monthly storage rental - January 2024"
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2024-002",
    customerId: "C002",
    customerName: "Sarah Johnson",
    amount: 240.00,
    status: "pending",
    issueDate: "2024-01-01",
    dueDate: "2024-01-31",
    unitIds: ["A-103", "B-201"],
    description: "Monthly storage rental - January 2024"
  },
  {
    id: "INV-003",
    invoiceNumber: "INV-2024-003",
    customerId: "C003",
    customerName: "Mike Wilson",
    amount: 180.00,
    status: "overdue",
    issueDate: "2023-12-01",
    dueDate: "2023-12-31",
    unitIds: ["B-201"],
    description: "Monthly storage rental - December 2023"
  },
  {
    id: "INV-004",
    invoiceNumber: "INV-2024-004",
    customerId: "C004",
    customerName: "Emily Davis",
    amount: 560.00,
    status: "draft",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    unitIds: ["C-301", "C-302"],
    description: "Monthly storage rental - February 2024"
  },
  {
    id: "INV-005",
    invoiceNumber: "INV-2024-005",
    customerId: "C001",
    customerName: "John Smith",
    amount: 185.00,
    status: "pending",
    issueDate: "2024-02-01",
    dueDate: "2024-02-28",
    unitIds: ["A-101"],
    description: "Monthly storage rental - February 2024"
  }
];

export const BillingView = () => {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.unitIds.some(unit => unit.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    const matchesAmount = amountFilter === "all" || 
                         (amountFilter === "under100" && invoice.amount < 100) ||
                         (amountFilter === "100to300" && invoice.amount >= 100 && invoice.amount <= 300) ||
                         (amountFilter === "over300" && invoice.amount > 300);
    
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "thisMonth" && new Date(invoice.issueDate).getMonth() === new Date().getMonth()) ||
                       (dateFilter === "lastMonth" && new Date(invoice.issueDate).getMonth() === new Date().getMonth() - 1) ||
                       (dateFilter === "overdue" && new Date(invoice.dueDate) < new Date() && invoice.status !== "paid");
    
    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
  });

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="p-6">
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
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-red-600">${overdueAmount.toFixed(2)}</p>
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
            </SelectContent>
          </Select>

          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All amounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All amounts</SelectItem>
              <SelectItem value="under100">Under $100</SelectItem>
              <SelectItem value="100to300">$100 - $300</SelectItem>
              <SelectItem value="over300">Over $300</SelectItem>
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
              <TableHead>Units</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-500">{invoice.description}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="font-medium text-gray-900">{invoice.customerName}</div>
                  <div className="text-sm text-gray-500">ID: {invoice.customerId}</div>
                </TableCell>
                
                <TableCell>
                  <span className="font-semibold text-gray-900">${invoice.amount.toFixed(2)}</span>
                </TableCell>
                
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {invoice.issueDate}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {invoice.dueDate}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {invoice.unitIds.join(", ")}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No invoices found matching your criteria.
          </div>
        )}
      </Card>
    </div>
  );
};
