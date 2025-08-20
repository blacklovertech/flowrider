import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: string;
  riderId: string;
  platform: string;
  category: 'food' | 'grocery' | 'courier' | 'taxi';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropLocation: string;
  earnings: number;
  createdAt: Date;
  estimatedTime: number; // in minutes
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      riderId: '1',
      platform: 'Zomato',
      category: 'food',
      status: 'completed',
      pickupLocation: 'McDonald\'s, Brigade Road',
      dropLocation: 'Koramangala 5th Block',
      earnings: 85,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estimatedTime: 25
    },
    {
      id: '2',
      riderId: '3',
      platform: 'Swiggy',
      category: 'food',
      status: 'in-progress',
      pickupLocation: 'KFC, MG Road',
      dropLocation: 'Whitefield Main Road',
      earnings: 95,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      estimatedTime: 35
    },
    {
      id: '3',
      riderId: '6',
      platform: 'Blinkit',
      category: 'grocery',
      status: 'assigned',
      pickupLocation: 'Reliance Fresh, HSR',
      dropLocation: 'Electronic City Phase 1',
      earnings: 45,
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      estimatedTime: 20
    },
    {
      id: '4',
      riderId: '4',
      platform: 'Dunzo',
      category: 'courier',
      status: 'completed',
      pickupLocation: 'Blue Dart Office, Indiranagar',
      dropLocation: 'HSR Layout Sector 3',
      earnings: 65,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      estimatedTime: 30
    },
    {
      id: '5',
      riderId: '2',
      platform: 'Rapido',
      category: 'taxi',
      status: 'completed',
      pickupLocation: 'Indiranagar Metro Station',
      dropLocation: 'Koramangala Forum Mall',
      earnings: 75,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      estimatedTime: 15
    }
  ]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};