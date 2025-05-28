
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useTasks } from '@/contexts/TaskContext';
import type { Unit, Customer } from '@/hooks/useAppState';

interface QuickTaskDialogProps {
  trigger?: React.ReactNode;
  units?: Unit[];
  customers?: Customer[];
  preselectedResource?: {
    type: 'customer' | 'unit' | 'lead' | 'subscription' | 'site';
    id: string;
    name: string;
  };
}

export const QuickTaskDialog = ({ 
  trigger, 
  units = [], 
  customers = [], 
  preselectedResource 
}: QuickTaskDialogProps) => {
  const { addTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>();
  const [relatedResource, setRelatedResource] = useState(preselectedResource || null);

  const teamMembers = [
    { id: 'john-doe', name: 'John Doe' },
    { id: 'jane-smith', name: 'Jane Smith' },
    { id: 'mike-wilson', name: 'Mike Wilson' },
  ];

  const allResources = [
    ...customers.map(c => ({ type: 'customer' as const, id: c.id, name: c.name })),
    ...units.map(u => ({ type: 'unit' as const, id: u.id, name: `Unit ${u.id}` })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const assignee = teamMembers.find(m => m.id === assignedTo);

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'todo',
      priority,
      assignedTo: assignedTo || undefined,
      assignedToName: assignee?.name,
      createdBy: 'current-user',
      createdByName: 'Current User',
      dueDate,
      relatedTo: relatedResource || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssignedTo('');
    setDueDate(undefined);
    if (!preselectedResource) {
      setRelatedResource(null);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/30" />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Task title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-medium"
                required
              />
            </div>

            <div>
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!preselectedResource && (
              <div>
                <Select
                  value={relatedResource ? `${relatedResource.type}:${relatedResource.id}` : ''}
                  onValueChange={(value) => {
                    if (!value) {
                      setRelatedResource(null);
                      return;
                    }
                    const [type, id] = value.split(':');
                    const resource = allResources.find(r => r.type === type && r.id === id);
                    if (resource) {
                      setRelatedResource(resource);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Relate to resource (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {allResources.map((resource) => (
                      <SelectItem key={`${resource.type}:${resource.id}`} value={`${resource.type}:${resource.id}`}>
                        {resource.type === 'customer' ? '👤' : '📦'} {resource.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : 'Set due date (optional)'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                Create Task
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
