import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, MapPin, Thermometer, Shield, Key, User, Calendar, DollarSign, Info } from "lucide-react";
import { useState } from "react";
import { AddCommentForm } from "./AddCommentForm";
import { EditUnitDialog } from "./EditUnitDialog";

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

interface UnitDetailsPageProps {
  unit: Unit;
  onBack: () => void;
  onUnitUpdate?: (updatedUnit: Unit) => void;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

const unitHistory = [
  {
    date: "2024-11-01",
    rentalPeriod: "Active Lease",
    rentedBy: "Jan Ingmar Karlsson",
    status: "active"
  },
  {
    date: "2022-05-02",
    rentalPeriod: "2022-05-02 - 2022-05-02",
    rentedBy: "Roeinvent AB Roeinvent AB",
    status: "completed"
  },
  {
    date: "2023-01-04",
    rentalPeriod: "2023-01-04 - 2024-02-02",
    rentedBy: "Lars Göran Sigurdsson",
    status: "completed"
  },
  {
    date: "2024-09-28",
    rentalPeriod: "2024-09-28 - 2024-10-13",
    rentedBy: "Maxime Anoman",
    status: "completed"
  }
];

export const UnitDetailsPage = ({ unit, onBack, onUnitUpdate }: UnitDetailsPageProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      text: "Unit was cleaned and inspected after last tenant moved out. Everything looks good.",
      author: "John Manager",
      date: "2024-01-15"
    },
    {
      id: "2",
      text: "Customer reported slight moisture issue. Maintenance team checked and resolved - no ongoing concerns.",
      author: "Sarah Maintenance",
      date: "2024-02-03"
    }
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUnitUpdate = (updatedUnit: Unit) => {
    onUnitUpdate?.(updatedUnit);
  };

  const handleAddComment = (newComment: Omit<Comment, 'id'>) => {
    const comment: Comment = {
      ...newComment,
      id: Date.now().toString()
    };
    setComments(prev => [comment, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHistoryStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "completed":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{unit.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(unit.status)}>
                  {unit.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button onClick={() => setIsEditDialogOpen(true)} className="flex items-center gap-2">
            <edit className="h-4 w-4" />
            Edit Unit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Unit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Storage Category</label>
                    <p className="text-gray-900">{unit.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Storage Number</label>
                    <p className="text-gray-900">{unit.id}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-gray-900">Building A</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Building</label>
                    <p className="text-gray-900">Main Storage</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-gray-900">{unit.size}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Size</label>
                    <p className="text-gray-900">{unit.size}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Conditions</label>
                    <p className="text-gray-900">{unit.climate ? "Climate Controlled" : "Standard"}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Security Deposit</label>
                    <p className="text-gray-900">$0.00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-600">Online unit description</label>
                  <p className="text-gray-900 mt-1">
                    Climate controlled storage unit with secure access. Perfect for temperature-sensitive items.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monthly Rate:</span>
                <span className="font-semibold text-gray-900">${unit.rate}</span>
              </div>
              
              {unit.tenant && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Tenant:</span>
                  <span className="text-sm font-medium text-blue-600">{unit.tenant}</span>
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

          <Card>
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                  Please add fee/service in admin master
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Unit History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tenant-roll">
              <TabsList>
                <TabsTrigger value="tenant-roll">Tenant Rent Roll</TabsTrigger>
                <TabsTrigger value="price-history">Price History</TabsTrigger>
                <TabsTrigger value="status-history">Status History</TabsTrigger>
                <TabsTrigger value="comments">Comments / Remarks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tenant-roll" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          <div className="flex items-center gap-2">
                            Date <Info className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          <div className="flex items-center gap-2">
                            Rental Period <Info className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          <div className="flex items-center gap-2">
                            Rented By <Info className="h-4 w-4" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitHistory.map((record, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{record.date}</td>
                          <td className="py-3 px-4">
                            <span className={getHistoryStatusColor(record.status)}>
                              {record.rentalPeriod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-blue-600">{record.rentedBy}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="price-history">
                <div className="text-center py-8 text-gray-500">
                  No price history available
                </div>
              </TabsContent>
              
              <TabsContent value="status-history">
                <div className="text-center py-8 text-gray-500">
                  No status history available
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="mt-6">
                <div className="space-y-4">
                  <AddCommentForm onAddComment={handleAddComment} />
                  
                  {comments.length > 0 ? (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{comment.author}</span>
                              </div>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                            <p className="text-gray-900">{comment.text}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No comments or remarks yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <EditUnitDialog
        unit={unit}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUnitUpdate}
      />
    </div>
  );
};
