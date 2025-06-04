
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

  console.log('ReservationSystem rendering with units:', units);

  // Safely filter available units
  const availableUnits = (units || []).filter(unit => {
    try {
      return unit && unit.status === "available";
    } catch (error) {
      console.error('Error filtering unit:', error, unit);
      return false;
    }
  });

  const handleReserveUnit = (unit: Unit) => {
    console.log('Reserving unit:', unit);
    
    if (!unit || !unit.id) {
      console.error('Invalid unit for reservation:', unit);
      return;
    }

    try {
      const reservation: Partial<Reservation> = {
        unitId: unit.id,
        startDate: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        totalAmount: unit.monthly_rate || 0,
      };
      onReserveUnit(unit.id, reservation);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const getDynamicPrice = (baseRate: number, occupancyRate: number) => {
    try {
      if (!baseRate || isNaN(baseRate)) return 0;
      if (!occupancyRate || isNaN(occupancyRate)) occupancyRate = 0;
      
      const demandMultiplier = occupancyRate > 0.8 ? 1.2 : occupancyRate > 0.6 ? 1.1 : 1.0;
      return Math.round(baseRate * demandMultiplier);
    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      return baseRate || 0;
    }
  };

  const siteOccupancy = (facilityId: string) => {
    try {
      if (!facilityId || !units || !Array.isArray(units)) return 0;
      
      const siteUnits = units.filter(u => u && u.facility_id === facilityId);
      if (siteUnits.length === 0) return 0;
      
      const occupiedUnits = siteUnits.filter(u => u && u.status === "occupied");
      return occupiedUnits.length / siteUnits.length;
    } catch (error) {
      console.error('Error calculating site occupancy:', error);
      return 0;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unit Reservation System</h1>
        <p className="text-gray-600">Real-time availability with dynamic pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableUnits.map((unit) => {
          if (!unit || !unit.id) {
            console.warn('Skipping invalid unit:', unit);
            return null;
          }

          try {
            const occupancyRate = siteOccupancy(unit.facility_id || '');
            const dynamicPrice = getDynamicPrice(unit.monthly_rate || 0, occupancyRate);
            const priceIncrease = dynamicPrice > (unit.monthly_rate || 0);

            return (
              <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{unit.unit_number || unit.id}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {unit.facility_id || 'Unknown Facility'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Size:</span>
                      <span className="font-medium">{unit.size || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="font-medium">{unit.type || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Climate:</span>
                      <span className="font-medium">{unit.climate_controlled ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <div className="text-right">
                        {priceIncrease && (
                          <span className="text-xs text-gray-400 line-through block">
                            ${unit.monthly_rate || 0}/month
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
          } catch (error) {
            console.error('Error rendering unit card:', error, unit);
            return null;
          }
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
