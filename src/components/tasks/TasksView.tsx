
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickTaskDialog } from './QuickTaskDialog';
import { TaskList } from './TaskList';
import { useTasks } from '@/contexts/TaskContext';
import type { Unit, Customer } from '@/hooks/useAppState';

interface TasksViewProps {
  units?: Unit[];
  customers?: Customer[];
}

export const TasksView = ({ units = [], customers = [] }: TasksViewProps) => {
  const { tasks } = useTasks();
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  const teamMembers = [
    { id: 'john-doe', name: 'John Doe' },
    { id: 'jane-smith', name: 'Jane Smith' },
    { id: 'mike-wilson', name: 'Mike Wilson' },
  ];

  const taskCounts = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => 
      t.dueDate && 
      t.dueDate < new Date() && 
      t.status !== 'completed'
    ).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and track your team's tasks</p>
        </div>
        <QuickTaskDialog units={units} customers={customers} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{taskCounts.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{taskCounts.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{taskCounts.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{taskCounts.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Lists */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Tasks
            {taskCounts.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {taskCounts.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="todo">
            To Do
            {taskCounts.todo > 0 && (
              <Badge variant="secondary" className="ml-2">
                {taskCounts.todo}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            {taskCounts.inProgress > 0 && (
              <Badge variant="secondary" className="ml-2">
                {taskCounts.inProgress}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {taskCounts.completed > 0 && (
              <Badge variant="secondary" className="ml-2">
                {taskCounts.completed}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskList 
            filterBy={{ assignedTo: selectedAssignee === 'all' ? undefined : selectedAssignee }}
            units={units}
            customers={customers}
          />
        </TabsContent>

        <TabsContent value="todo">
          <TaskList 
            filterBy={{ 
              status: 'todo', 
              assignedTo: selectedAssignee === 'all' ? undefined : selectedAssignee 
            }}
            units={units}
            customers={customers}
          />
        </TabsContent>

        <TabsContent value="in-progress">
          <TaskList 
            filterBy={{ 
              status: 'in-progress', 
              assignedTo: selectedAssignee === 'all' ? undefined : selectedAssignee 
            }}
            units={units}
            customers={customers}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList 
            filterBy={{ 
              status: 'completed', 
              assignedTo: selectedAssignee === 'all' ? undefined : selectedAssignee 
            }}
            units={units}
            customers={customers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
