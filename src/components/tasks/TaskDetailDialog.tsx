
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useTasks } from '@/contexts/TaskContext';
import type { Task } from '@/types/task';
import type { Unit, Customer } from '@/hooks/useAppState';

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  units?: Unit[];
  customers?: Customer[];
}

export const TaskDetailDialog = ({ 
  task, 
  open, 
  onClose, 
  units = [], 
  customers = [] 
}: TaskDetailDialogProps) => {
  const { updateTask, addTaskNote } = useTasks();
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSaveEdit = () => {
    updateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    addTaskNote(task.id, {
      content: newNote.trim(),
      author: 'current-user',
      authorName: 'Current User',
    });

    setNewNote('');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 font-semibold"
              />
            ) : (
              <DialogTitle className="flex-1">{task.title}</DialogTitle>
            )}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            {/* Task Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Priority</div>
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                  {task.priority}
                </Badge>
              </div>
              {task.assignedToName && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Assigned to</div>
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-3 w-3" />
                    {task.assignedToName}
                  </div>
                </div>
              )}
              {task.dueDate && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Due date</div>
                  <div className={`flex items-center gap-1 text-sm ${
                    task.dueDate < new Date() && task.status !== 'completed' 
                      ? 'text-red-600' 
                      : ''
                  }`}>
                    <Calendar className="h-3 w-3" />
                    {format(task.dueDate, 'PPP')}
                  </div>
                </div>
              )}
              {task.relatedTo && (
                <div className="col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Related to</div>
                  <div className="flex items-center gap-1 text-sm">
                    {task.relatedTo.type === 'customer' ? '👤' : '📦'}
                    {task.relatedTo.name}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Description</div>
              {isEditing ? (
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Task description..."
                  rows={3}
                />
              ) : (
                <div className="text-sm text-gray-600">
                  {task.description || 'No description provided.'}
                </div>
              )}
            </div>

            <Separator />

            {/* Notes Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Discussion ({task.notes.length})</span>
              </div>

              {/* Add new note */}
              <div className="flex gap-2 mb-4">
                <Textarea
                  placeholder="Add a note or update..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  size="icon"
                  className="mt-auto"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Notes list */}
              <div className="space-y-3">
                {task.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{note.authorName}</span>
                      <span className="text-xs text-gray-500">
                        {format(note.createdAt, 'MMM d, yyyy \'at\' h:mm a')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </div>
                  </div>
                ))}
                {task.notes.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No notes yet. Start the discussion!
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
