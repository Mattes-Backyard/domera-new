
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Key, MapPin } from "lucide-react";
import type { Unit } from "@/hooks/useAppState";
import type { Reservation } from "@/types/reservation";

interface ReservationSystemProps {
  units: Unit[];
  onReserveUnit: (unitId: string, reservation: Partial<Reservation>) => void;
}

export const ReservationSystem = ({ units, onReserveUnit }: ReservationSystemProps) => {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const availableUnits = units.filter(unit => unit.status === "available");

  const handleReserveUnit = (unit: Unit) => {
    const reservation: Partial<Reservation> = {
      unitId: unit.id,
      startDate: new Date().toISOString(),
      status: "pending",
      paymentStatus: "pending",
      totalAmount: unit.rate,
    };
    onReserveUnit(unit.id, reservation);
  };

  const getDynamicPrice = (baseRate: number, occupancyRate: number) => {
    // Simple dynamic pricing algorithm
    const demandMultiplier = occupancyRate > 0.8 ? 1.2 : occupancyRate > 0.6 ? 1.1 : 1.0;
    return Math.round(baseRate * demandMultiplier);
  };

  const siteOccupancy = (site: string) => {
    const siteUnits = units.filter(u => u.site === site);
    const occupiedUnits = siteUnits.filter(u => u.status === "occupied");
    return occupiedUnits.length / siteUnits.length;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unit Reservation System</h1>
        <p className="text-gray-600">Real-time availability with dynamic pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableUnits.map((unit) => {
          const occupancyRate = siteOccupancy(unit.site);
          const dynamicPrice = getDynamicPrice(unit.rate, occupancyRate);
          const priceIncrease = dynamicPrice > unit.rate;

          return (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{unit.id}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {unit.site}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="font-medium">{unit.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-medium">{unit.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Climate:</span>
                    <span className="font-medium">{unit.climate ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price:</span>
                    <div className="text-right">
                      {priceIncrease && (
                        <span className="text-xs text-gray-400 line-through block">
                          ${unit.rate}/month
                        </span>
                      )}
                      <span className={`font-bold ${priceIncrease ? 'text-orange-600' : 'text-gray-900'}`}>
                        ${dynamicPrice}/month
                      </span>
                      {priceIncrease && (
                        <span className="text-xs text-orange-600 block">High demand</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleReserveUnit(unit)}
                    className="w-full flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Reserve Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {availableUnits.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No units available for reservation at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
