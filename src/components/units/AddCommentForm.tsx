
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

interface AddCommentFormProps {
  onAddComment: (comment: Omit<Comment, 'id'>) => void;
}

export const AddCommentForm = ({ onAddComment }: AddCommentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !author.trim()) return;
    
    const newComment = {
      text: comment.trim(),
      author: author.trim(),
      date: new Date().toLocaleDateString()
    };
    
    onAddComment(newComment);
    setComment("");
    setAuthor("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setComment("");
    setAuthor("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Comment
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="author">Your Name</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment or remark"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Comment</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
