
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UnitAmenitiesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
            Please add amenity in admin master
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
