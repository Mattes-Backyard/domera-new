
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  dueDate?: Date;
  relatedTo?: {
    type: 'customer' | 'unit' | 'lead' | 'subscription' | 'site';
    id: string;
    name: string;
  };
  notes: TaskNote[];
}

export interface TaskNote {
  id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: Date;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'notes'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addTaskNote: (taskId: string, note: Omit<TaskNote, 'id' | 'createdAt'>) => void;
  getTasksByResource: (resourceType: string, resourceId: string) => Task[];
  getTasksByAssignee: (assigneeId: string) => Task[];
}
