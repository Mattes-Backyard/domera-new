
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Shield, User, History } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

interface CurrentRental {
  customer_name: string;
  start_date: string;
  monthly_rate: number;
  phone?: string;
  email?: string;
}

interface UnitQuickInfoProps {
  unit: Unit;
}

export const UnitQuickInfo = ({ unit }: UnitQuickInfoProps) => {
  const [currentRental, setCurrentRental] = useState<CurrentRental | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentRental = async () => {
      if (!unit.id) return;
      
      setLoading(true);
      try {
        // Get the actual unit record to get the UUID
        const { data: unitRecord } = await supabase
          .from('units')
          .select('id')
          .eq('unit_number', unit.id)
          .single();

        if (unitRecord) {
          // Get current active rental with customer information
          const { data: rental } = await supabase
            .from('unit_rentals')
            .select(`
              start_date,
              monthly_rate,
              customer:customers(
                first_name,
                last_name,
                phone,
                email
              )
            `)
            .eq('unit_id', unitRecord.id)
            .eq('is_active', true)
            .single();

          if (rental && rental.customer) {
            setCurrentRental({
              customer_name: `${rental.customer.first_name || ''} ${rental.customer.last_name || ''}`.trim(),
              start_date: rental.start_date,
              monthly_rate: rental.monthly_rate,
              phone: rental.customer.phone,
              email: rental.customer.email
            });
          }
        }
      } catch (error) {
        console.error('Error fetching current rental:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentRental();
  }, [unit.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Quick Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Monthly Rate:</span>
          <span className="font-semibold text-gray-900">${unit.rate}</span>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        ) : currentRental ? (
          <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Current Tenant</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-blue-700">{currentRental.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Since:</span>
                <span className="text-blue-700">{new Date(currentRental.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="text-blue-700">${currentRental.monthly_rate}</span>
              </div>
              {currentRental.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-blue-700">{currentRental.phone}</span>
                </div>
              )}
            </div>
          </div>
        ) : unit.status === 'occupied' ? (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <History className="h-4 w-4" />
              <span className="text-sm">Unit marked as occupied but no active rental found</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm">No current tenant</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {unit.climate && (
            <Badge variant="outline" className="text-xs">
              <Thermometer className="h-3 w-3 mr-1" />
              Climate
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
