
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, User } from "lucide-react";
import { useState, useEffect } from "react";
import { AddCommentForm } from "./AddCommentForm";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

interface RentalHistory {
  id: string;
  start_date: string;
  end_date: string | null;
  customer_name: string;
  monthly_rate: number;
  is_active: boolean;
}

interface UnitHistoryTabsProps {
  unitId?: string;
}

const initialComments: Comment[] = [
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
];

export const UnitHistoryTabs = ({ unitId }: UnitHistoryTabsProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRentalHistory = async () => {
      if (!unitId) return;
      
      setLoading(true);
      try {
        // Get the actual unit record to get the UUID
        const { data: unitRecord } = await supabase
          .from('units')
          .select('id')
          .eq('unit_number', unitId)
          .single();

        if (unitRecord) {
          // Get all rentals for this unit with customer information
          const { data: rentals } = await supabase
            .from('unit_rentals')
            .select(`
              id,
              start_date,
              end_date,
              monthly_rate,
              is_active,
              customer:customers(
                first_name,
                last_name
              )
            `)
            .eq('unit_id', unitRecord.id)
            .order('start_date', { ascending: false });

          if (rentals) {
            const formattedHistory = rentals.map(rental => ({
              id: rental.id,
              start_date: rental.start_date,
              end_date: rental.end_date,
              customer_name: rental.customer 
                ? `${rental.customer.first_name || ''} ${rental.customer.last_name || ''}`.trim()
                : 'Unknown Customer',
              monthly_rate: rental.monthly_rate,
              is_active: rental.is_active
            }));
            setRentalHistory(formattedHistory);
          }
        }
      } catch (error) {
        console.error('Error fetching rental history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, [unitId]);

  const handleAddComment = (newComment: Omit<Comment, 'id'>) => {
    const comment: Comment = {
      ...newComment,
      id: Date.now().toString()
    };
    setComments(prev => [comment, ...prev]);
  };

  const getRentalStatusDisplay = (rental: RentalHistory) => {
    if (rental.is_active) {
      return {
        text: "Active Lease",
        color: "text-green-600"
      };
    } else {
      const startDate = new Date(rental.start_date).toLocaleDateString();
      const endDate = rental.end_date ? new Date(rental.end_date).toLocaleDateString() : 'Ongoing';
      return {
        text: `${startDate} - ${endDate}`,
        color: "text-blue-600"
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customer-roll">
          <TabsList>
            <TabsTrigger value="customer-roll">Customer Rent Roll</TabsTrigger>
            <TabsTrigger value="price-history">Price History</TabsTrigger>
            <TabsTrigger value="status-history">Status History</TabsTrigger>
            <TabsTrigger value="comments">Comments / Remarks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer-roll" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading rental history...</span>
              </div>
            ) : (
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
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          Monthly Rate <Info className="h-4 w-4" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalHistory.length > 0 ? (
                      rentalHistory.map((rental) => {
                        const statusDisplay = getRentalStatusDisplay(rental);
                        return (
                          <tr key={rental.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-900">
                              {new Date(rental.start_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={statusDisplay.color}>
                                {statusDisplay.text}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-blue-600">{rental.customer_name}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-900">
                              ${rental.monthly_rate}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No rental history available for this unit
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
  );
};
