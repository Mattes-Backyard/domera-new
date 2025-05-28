
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare } from 'lucide-react';
import { QuickTaskDialog } from './QuickTaskDialog';
import { TaskList } from './TaskList';
import { useTasks } from '@/contexts/TaskContext';
import type { Unit, Customer } from '@/hooks/useAppState';

interface TaskWidgetProps {
  resourceType: 'customer' | 'unit';
  resourceId: string;
  resourceName: string;
  units?: Unit[];
  customers?: Customer[];
}

export const TaskWidget = ({ 
  resourceType, 
  resourceId, 
  resourceName, 
  units = [], 
  customers = [] 
}: TaskWidgetProps) => {
  const { getTasksByResource } = useTasks();
  
  const relatedTasks = getTasksByResource(resourceType, resourceId);
  const activeTasks = relatedTasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');

  const preselectedResource = {
    type: resourceType,
    id: resourceId,
    name: resourceName,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            <CardTitle className="text-lg">Tasks</CardTitle>
            {activeTasks.length > 0 && (
              <Badge variant="secondary">
                {activeTasks.length} active
              </Badge>
            )}
          </div>
          <QuickTaskDialog
            trigger={
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
            }
            preselectedResource={preselectedResource}
            units={units}
            customers={customers}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {relatedTasks.length > 0 ? (
          <TaskList
            filterBy={{ resourceType, resourceId }}
            showCreateButton={false}
            units={units}
            customers={customers}
          />
        ) : (
          <div className="text-center py-6 text-gray-500">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No tasks yet</p>
            <p className="text-sm">Create a task to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
