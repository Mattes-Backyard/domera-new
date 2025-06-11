import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, User } from "lucide-react";
import { useState, useEffect } from "react";
import { AddCommentForm } from "./AddCommentForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  comment_text: string;
  author_name: string;
  created_at: string;
}

interface RentalHistory {
  id: string;
  start_date: string;
  end_date: string | null;
  customer_name: string;
  monthly_rate: number;
  is_active: boolean;
}

interface StatusHistory {
  id: string;
  status: string;
  previous_status: string | null;
  reason: string | null;
  created_at: string;
  changed_by_name?: string;
}

interface PriceHistory {
  id: string;
  monthly_rate: number;
  previous_rate: number | null;
  effective_date: string;
  reason: string | null;
  created_at: string;
  changed_by_name?: string;
}

interface UnitHistoryTabsProps {
  unitId?: string;
}

export const UnitHistoryTabs = ({ unitId }: UnitHistoryTabsProps) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [unitUuid, setUnitUuid] = useState<string | null>(null);

  // Get the unit UUID from unit number
  useEffect(() => {
    const fetchUnitUuid = async () => {
      if (!unitId) return;
      
      try {
        const { data: unitRecord } = await supabase
          .from('units')
          .select('id')
          .eq('unit_number', unitId)
          .single();

        if (unitRecord) {
          setUnitUuid(unitRecord.id);
        }
      } catch (error) {
        console.error('Error fetching unit UUID:', error);
      }
    };

    fetchUnitUuid();
  }, [unitId]);

  // Fetch all history data
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!unitUuid) return;
      
      setLoading(true);
      try {
        // Fetch rental history
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
          .eq('unit_id', unitUuid)
          .order('start_date', { ascending: false });

        if (rentals) {
          const formattedRentals = rentals.map(rental => ({
            id: rental.id,
            start_date: rental.start_date,
            end_date: rental.end_date,
            customer_name: rental.customer 
              ? `${rental.customer.first_name || ''} ${rental.customer.last_name || ''}`.trim()
              : 'Unknown Customer',
            monthly_rate: rental.monthly_rate,
            is_active: rental.is_active
          }));
          setRentalHistory(formattedRentals);
        }

        // Fetch status history
        const { data: statusData } = await supabase
          .from('unit_status_history')
          .select(`
            id,
            status,
            previous_status,
            reason,
            created_at,
            changed_by
          `)
          .eq('unit_id', unitUuid)
          .order('created_at', { ascending: false });

        if (statusData) {
          setStatusHistory(statusData.map(item => ({
            id: item.id,
            status: item.status,
            previous_status: item.previous_status,
            reason: item.reason,
            created_at: item.created_at,
            changed_by_name: 'System User' // Could be enhanced to fetch actual user names
          })));
        }

        // Fetch price history
        const { data: priceData } = await supabase
          .from('unit_price_history')
          .select(`
            id,
            monthly_rate,
            previous_rate,
            effective_date,
            reason,
            created_at,
            changed_by
          `)
          .eq('unit_id', unitUuid)
          .order('effective_date', { ascending: false });

        if (priceData) {
          setPriceHistory(priceData.map(item => ({
            id: item.id,
            monthly_rate: item.monthly_rate,
            previous_rate: item.previous_rate,
            effective_date: item.effective_date,
            reason: item.reason,
            created_at: item.created_at,
            changed_by_name: 'System User' // Could be enhanced to fetch actual user names
          })));
        }

        // Fetch comments
        const { data: commentsData } = await supabase
          .from('unit_comments')
          .select('id, comment_text, author_name, created_at')
          .eq('unit_id', unitUuid)
          .order('created_at', { ascending: false });

        if (commentsData) {
          setComments(commentsData);
        }

      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [unitUuid]);

  const handleAddComment = async (commentText: string) => {
    if (!unitUuid || !user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('unit_comments')
        .insert({
          unit_id: unitUuid,
          author_id: user.id,
          author_name: profile.first_name && profile.last_name 
            ? `${profile.first_name} ${profile.last_name}`.trim()
            : profile.email || 'Anonymous User',
          comment_text: commentText
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return;
      }

      if (data) {
        setComments(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          </TabsContent>
          
          <TabsContent value="price-history" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Effective Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">New Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Previous Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Change</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.length > 0 ? (
                    priceHistory.map((price) => {
                      const change = price.previous_rate 
                        ? ((price.monthly_rate - price.previous_rate) / price.previous_rate * 100).toFixed(1)
                        : null;
                      return (
                        <tr key={price.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">
                            {new Date(price.effective_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-900">${price.monthly_rate}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {price.previous_rate ? `$${price.previous_rate}` : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {change && (
                              <span className={parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {parseFloat(change) >= 0 ? '+' : ''}{change}%
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{price.reason || 'No reason provided'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No price history available for this unit
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="status-history" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status Change</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Changed By</th>
                  </tr>
                </thead>
                <tbody>
                  {statusHistory.length > 0 ? (
                    statusHistory.map((status) => (
                      <tr key={status.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(status.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600">
                            {status.previous_status || 'Initial'} → <span className="text-blue-600">{status.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{status.reason || 'No reason provided'}</td>
                        <td className="py-3 px-4 text-gray-600">{status.changed_by_name || 'System'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No status history available for this unit
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                            <span className="font-medium">{comment.author_name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-900">{comment.comment_text}</p>
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
