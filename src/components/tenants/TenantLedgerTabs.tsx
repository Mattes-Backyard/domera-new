import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";

interface TenantUnit {
  unitId: string;
  unitNumber: string;
  status: "good" | "overdue" | "pending";
  monthlyRate: number;
  leaseStart: string;
  leaseEnd?: string;
  balance: number;
}

interface LedgerEntry {
  id: string;
  date: string;
  type: "invoice" | "payment";
  description: string;
  invoiceNumber?: string;
  debit: number;
  credit: number;
  balance: number;
}

interface TenantLedgerTabsProps {
  tenantId: string;
  units: TenantUnit[];
  selectedUnit: string;
}

export const TenantLedgerTabs = ({ tenantId, units, selectedUnit }: TenantLedgerTabsProps) => {
  const { invoices, downloadInvoicePDF, previewInvoicePDF } = useInvoices();
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  
  const selectedUnitData = units.find(unit => unit.unitId === selectedUnit);

  useEffect(() => {
    // Filter invoices for this specific tenant and create ledger entries
    const tenantInvoices = invoices.filter(invoice => invoice.customer_id === tenantId);
    
    const entries: LedgerEntry[] = [];
    let runningBalance = 0;

    // Sort invoices by date
    tenantInvoices.sort((a, b) => new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime());

    tenantInvoices.forEach((invoice) => {
      // Add invoice entry (debit)
      runningBalance += invoice.total_amount;
      entries.push({
        id: `inv-${invoice.id}`,
        date: invoice.issue_date,
        type: "invoice",
        description: `Monthly rental - ${invoice.invoice_number}`,
        invoiceNumber: invoice.invoice_number,
        debit: invoice.total_amount,
        credit: 0,
        balance: runningBalance
      });

      // If invoice is paid, add payment entry (credit)
      if (invoice.status === 'paid') {
        runningBalance -= invoice.total_amount;
        entries.push({
          id: `pay-${invoice.id}`,
          date: invoice.due_date, // Simplified - in real scenario you'd have payment date
          type: "payment",
          description: `Payment for ${invoice.invoice_number}`,
          debit: 0,
          credit: invoice.total_amount,
          balance: runningBalance
        });
      }
    });

    // Sort entries by date (most recent first for display)
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setLedgerEntries(entries);
  }, [invoices, tenantId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payment":
        return "bg-green-100 text-green-800";
      case "invoice":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePreviewInvoice = async (invoiceNumber: string) => {
    const invoice = invoices.find(inv => inv.invoice_number === invoiceNumber);
    if (invoice) {
      await previewInvoicePDF(invoice);
    }
  };

  const handleDownloadInvoice = async (invoiceNumber: string) => {
    const invoice = invoices.find(inv => inv.invoice_number === invoiceNumber);
    if (invoice) {
      await downloadInvoicePDF(invoice);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Lease Information - {selectedUnitData?.unitNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ledger">
          <TabsList>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="lease-details">Lease Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ledger" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Show {ledgerEntries.length} item(s)</span>
                <span>Current Balance: €{selectedUnitData?.balance || 0}</span>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Unit #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{selectedUnitData?.unitNumber}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(entry.type)}>
                        {entry.type === "invoice" && entry.invoiceNumber 
                          ? `Invoice - #${entry.invoiceNumber}`
                          : entry.type === "payment" 
                          ? "Payment"
                          : entry.type
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {entry.description}
                        {entry.type === "invoice" && (
                          <div className="text-blue-600 text-xs cursor-pointer">View More</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{entry.debit > 0 ? `€${entry.debit.toFixed(2)}` : "€0.00"}</TableCell>
                    <TableCell>{entry.credit > 0 ? `€${entry.credit.toFixed(2)}` : "€0.00"}</TableCell>
                    <TableCell>€{entry.balance.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {entry.type === "invoice" && entry.invoiceNumber && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePreviewInvoice(entry.invoiceNumber!)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(entry.invoiceNumber!)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">⋮</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {ledgerEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No ledger entries found for this tenant.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="lease-details" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Lease Start</p>
                  <p className="font-medium">{selectedUnitData?.leaseStart}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lease End</p>
                  <p className="font-medium">{selectedUnitData?.leaseEnd || "Active Lease"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Rate</p>
                  <p className="font-medium">€{selectedUnitData?.monthlyRate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="font-medium">€{selectedUnitData?.balance}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Available Documents</h4>
              {ledgerEntries
                .filter(entry => entry.type === "invoice" && entry.invoiceNumber)
                .map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Invoice {entry.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">Date: {entry.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreviewInvoice(entry.invoiceNumber!)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(entry.invoiceNumber!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              
              {ledgerEntries.filter(entry => entry.type === "invoice").length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No documents available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
