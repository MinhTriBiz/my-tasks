export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  location?: string;
  reminderAt?: Date;
  reminderEnabled: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  username?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';
