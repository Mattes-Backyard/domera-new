
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Calendar, User, MessageSquare } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useTasks } from '@/contexts/TaskContext';
import { TaskDetailDialog } from './TaskDetailDialog';
import type { Task } from '@/types/task';
import type { Unit } from '@/hooks/useAppState';
import type { Customer } from '@/types/customer';

interface TaskListProps {
  filterBy?: {
    status?: Task['status'];
    assignedTo?: string;
    resourceType?: string;
    resourceId?: string;
  };
  showCreateButton?: boolean;
  units?: Unit[];
  customers?: Customer[];
}

export const TaskList = ({ 
  filterBy, 
  showCreateButton = true, 
  units = [], 
  customers = [] 
}: TaskListProps) => {
  const { tasks, updateTask, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (filterBy?.status && task.status !== filterBy.status) return false;
    if (filterBy?.assignedTo && task.assignedTo !== filterBy.assignedTo) return false;
    if (filterBy?.resourceType && filterBy?.resourceId) {
      if (!task.relatedTo || 
          task.relatedTo.type !== filterBy.resourceType || 
          task.relatedTo.id !== filterBy.resourceId) {
        return false;
      }
    }
    return true;
  });

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

  const handleStatusChange = (taskId: string, completed: boolean) => {
    updateTask(taskId, { 
      status: completed ? 'completed' : 'todo' 
    });
  };

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={(checked) => handleStatusChange(task.id, checked as boolean)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 
                      className={`font-medium cursor-pointer hover:text-blue-600 ${
                        task.status === 'completed' ? 'line-through text-gray-500' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateTask(task.id, { 
                          status: task.status === 'in-progress' ? 'todo' : 'in-progress' 
                        })}
                      >
                        {task.status === 'in-progress' ? 'Mark as Todo' : 'Mark In Progress'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                    {task.priority}
                  </Badge>
                  
                  <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </Badge>

                  {task.assignedToName && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <User className="h-3 w-3" />
                      {task.assignedToName}
                    </div>
                  )}

                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-xs ${
                      task.dueDate < new Date() && task.status !== 'completed' 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      <Calendar className="h-3 w-3" />
                      {format(task.dueDate, 'MMM d')}
                    </div>
                  )}

                  {task.relatedTo && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      {task.relatedTo.type === 'customer' ? '👤' : '📦'}
                      {task.relatedTo.name}
                    </div>
                  )}

                  {task.notes.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MessageSquare className="h-3 w-3" />
                      {task.notes.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            No tasks found. Create your first task to get started!
          </CardContent>
        </Card>
      )}

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          units={units}
          customers={customers}
        />
      )}
    </div>
  );
};
