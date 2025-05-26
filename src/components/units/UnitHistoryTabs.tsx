
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, User } from "lucide-react";
import { useState } from "react";
import { AddCommentForm } from "./AddCommentForm";

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

export const UnitHistoryTabs = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleAddComment = (newComment: Omit<Comment, 'id'>) => {
    const comment: Comment = {
      ...newComment,
      id: Date.now().toString()
    };
    setComments(prev => [comment, ...prev]);
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
  );
};
