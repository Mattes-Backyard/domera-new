
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface AddCommentFormProps {
  onAddComment: (commentText: string) => Promise<void>;
}

export const AddCommentForm = ({ onAddComment }: AddCommentFormProps) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    
    try {
      await onAddComment(commentText.trim());
      setCommentText("");
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MessageSquare className="h-4 w-4" />
        Add New Comment
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder="Enter your comment or remark about this unit..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!commentText.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </div>
    </form>
  );
};
