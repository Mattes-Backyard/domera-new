
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Edit2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  comment_text: string;
  author_name: string;
  created_at: string;
  updated_at?: string;
  author_id: string;
}

interface AddCommentFormProps {
  onAddComment: (commentText: string) => Promise<void>;
  onUpdateComment?: (commentId: string, commentText: string) => Promise<void>;
  editingComment?: Comment | null;
  onCancelEdit?: () => void;
}

export const AddCommentForm = ({ 
  onAddComment, 
  onUpdateComment, 
  editingComment, 
  onCancelEdit 
}: AddCommentFormProps) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState(editingComment?.comment_text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    
    try {
      if (editingComment && onUpdateComment) {
        await onUpdateComment(editingComment.id, commentText.trim());
        if (onCancelEdit) onCancelEdit();
      } else {
        await onAddComment(commentText.trim());
      }
      
      if (!editingComment) {
        setCommentText("");
      }
    } catch (error) {
      console.error('Error with comment operation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCommentText(editingComment?.comment_text || "");
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {editingComment ? (
          <>
            <Edit2 className="h-4 w-4" />
            Edit Comment
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            Add New Comment
          </>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder={editingComment ? "Edit your comment..." : "Enter your comment or remark about this unit..."}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        {editingComment && onCancelEdit && (
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={!commentText.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? (
            editingComment ? "Updating..." : "Adding..."
          ) : (
            <>
              {editingComment ? (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Update Comment
                </>
              ) : (
                "Add Comment"
              )}
            </>
          )}
        </Button>
      </div>
      
      {editingComment && (
        <div className="text-xs text-gray-500 border-t pt-2">
          Originally posted by {editingComment.author_name} on {new Date(editingComment.created_at).toLocaleDateString()}
          {editingComment.updated_at && (
            <span className="block">Last updated: {new Date(editingComment.updated_at).toLocaleDateString()}</span>
          )}
        </div>
      )}
    </form>
  );
};
