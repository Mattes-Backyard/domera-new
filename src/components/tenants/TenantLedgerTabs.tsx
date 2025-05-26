
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

// Mock data for demonstration
const mockLedgerData: Record<string, LedgerEntry[]> = {
  "A-101": [
    {
      id: "1",
      date: "2025-05-02",
      type: "payment",
      description: "Payment - #6755",
      debit: 0,
      credit: 678,
      balance: 0
    },
    {
      id: "2",
      date: "2025-05-01",
      type: "invoice",
      description: "Invoice #7333",
      invoiceNumber: "7333",
      debit: 678,
      credit: 0,
      balance: 678
    },
    {
      id: "3",
      date: "2025-04-01",
      type: "payment",
      description: "Payment - #6358",
      debit: 0,
      credit: 678,
      balance: 0
    },
    {
      id: "4",
      date: "2025-04-01",
      type: "invoice",
      description: "Invoice #6860",
      invoiceNumber: "6860",
      debit: 678,
      credit: 0,
      balance: 678
    }
  ]
};

export const TenantLedgerTabs = ({ tenantId, units, selectedUnit }: TenantLedgerTabsProps) => {
  const selectedUnitData = units.find(unit => unit.unitId === selectedUnit);
  const ledgerEntries = mockLedgerData[selectedUnit] || [];

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
                <span>Show 10 item(s)</span>
                <span>Balance: ${selectedUnitData?.balance || 0}</span>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desired Date</TableHead>
                  <TableHead>Unit #</TableHead>
                  <TableHead>Invoice/Receipt Details</TableHead>
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
                          : entry.description.split(" - ")[1] || entry.description
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {entry.description}
                        <div className="text-blue-600 text-xs cursor-pointer">View More</div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.debit > 0 ? `${entry.debit}.00 kr` : "0.00 kr"}</TableCell>
                    <TableCell>{entry.credit > 0 ? `${entry.credit}.00 kr` : "0.00 kr"}</TableCell>
                    <TableCell>{entry.balance}.00 kr</TableCell>
                    <TableCell>
                      <button className="text-gray-400 hover:text-gray-600">⋮</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <p className="font-medium">${selectedUnitData?.monthlyRate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="font-medium">${selectedUnitData?.balance}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <div className="text-center py-8 text-gray-500">
              No documents available
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
