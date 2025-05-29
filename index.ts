export type Priority = 'low' | 'medium' | 'high';

export type SortOption = 'dueDate' | 'priority' | 'createdAt' | 'manual';
export type SortDirection = 'asc' | 'desc';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: Priority;
  categoryId?: string;
  tags: string[]; // Array of tag IDs
  order?: number; // For manual sorting
};

export type TodoFilters = {
  searchTerm: string;
  priority: Priority | 'all';
  categoryId: string | 'all';
  tags: string[]; // Array of tag IDs to filter by
  showCompleted: boolean;
};

export type TodoSort = {
  option: SortOption;
  direction: SortDirection;
};

export type Theme = {
  name: string;
  background?: string; // URL for custom background
  isDark: boolean;
};