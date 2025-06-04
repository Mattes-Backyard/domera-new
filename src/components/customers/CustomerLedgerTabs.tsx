
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerUnit } from "@/types/customer";

interface CustomerLedgerTabsProps {
  customerId: string;
  units: CustomerUnit[];
  selectedUnit: string;
}

export const CustomerLedgerTabs = ({ customerId, units, selectedUnit }: CustomerLedgerTabsProps) => {
  const selectedUnitData = units.find(unit => unit.unitId === selectedUnit);

  return (
    <Tabs defaultValue="payments" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="payments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No payment history available</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="invoices" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No invoices available</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No documents available</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
