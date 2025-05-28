
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Task, TaskNote, TaskContextType } from '@/types/task';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'notes'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      notes: [],
    };

    setTasks(prev => [newTask, ...prev]);
    console.log('New task created:', newTask);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const addTaskNote = useCallback((taskId: string, noteData: Omit<TaskNote, 'id' | 'createdAt'>) => {
    const newNote: TaskNote = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, notes: [newNote, ...task.notes] }
          : task
      )
    );
  }, []);

  const getTasksByResource = useCallback((resourceType: string, resourceId: string) => {
    return tasks.filter(task => 
      task.relatedTo?.type === resourceType && task.relatedTo?.id === resourceId
    );
  }, [tasks]);

  const getTasksByAssignee = useCallback((assigneeId: string) => {
    return tasks.filter(task => task.assignedTo === assigneeId);
  }, [tasks]);

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    addTaskNote,
    getTasksByResource,
    getTasksByAssignee,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
