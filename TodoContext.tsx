import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Todo, TodoFilters, Priority, Category, Tag, TodoSort, Theme } from '../types';

// Context state
type TodoContextState = {
  todos: Todo[];
  categories: Category[];
  tags: Tag[];
  filters: TodoFilters;
  sort: TodoSort;
  theme: Theme;
  dispatch: React.Dispatch<TodoAction>;
};

// Default filters
const defaultFilters: TodoFilters = {
  searchTerm: '',
  priority: 'all',
  categoryId: 'all',
  tags: [],
  showCompleted: true,
};

// Default sort
const defaultSort: TodoSort = {
  option: 'createdAt',
  direction: 'desc',
};

// Default theme
const defaultTheme: Theme = {
  name: 'system',
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

// Actions
type TodoAction =
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'REMOVE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'REORDER_TODOS'; payload: Todo[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_TAGS'; payload: Tag[] }
  | { type: 'SET_FILTER'; payload: Partial<TodoFilters> }
  | { type: 'SET_SORT'; payload: Partial<TodoSort> }
  | { type: 'SET_THEME'; payload: Partial<Theme> };

// Create context
const TodoContext = createContext<TodoContextState | undefined>(undefined);

// Reducer function
const todoReducer = (
  state: TodoContextState,
  action: TodoAction
): TodoContextState => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'REORDER_TODOS':
      return { ...state, todos: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SORT':
      return { ...state, sort: { ...state.sort, ...action.payload } };
    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload } };
    default:
      return state;
  }
};

// Provider component
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    categories: [],
    tags: [],
    filters: defaultFilters,
    sort: defaultSort,
    theme: defaultTheme,
    dispatch: () => null, // Will be replaced by the actual dispatch
  });

  // Update theme when dark mode changes
  useEffect(() => {
    if (state.theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme.isDark]);

  return (
    <TodoContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the todo context
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

// Helper function to get filtered and sorted todos
export const useFilteredTodos = () => {
  const { todos, filters, sort } = useTodoContext();

  // First, filter todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    const matchesPriority =
      filters.priority === 'all' || todo.priority === filters.priority;
    const matchesCategory =
      filters.categoryId === 'all' || todo.categoryId === filters.categoryId;
    const matchesTags =
      filters.tags.length === 0 ||
      filters.tags.some((tagId) => todo.tags.includes(tagId));
    const matchesCompleted = filters.showCompleted || !todo.completed;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesCategory &&
      matchesTags &&
      matchesCompleted
    );
  });

  // Then, sort todos
  return [...filteredTodos].sort((a, b) => {
    switch (sort.option) {
      case 'dueDate':
        if (!a.dueDate) return sort.direction === 'asc' ? 1 : -1;
        if (!b.dueDate) return sort.direction === 'asc' ? -1 : 1;
        return sort.direction === 'asc'
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime();
      case 'priority':
        const priorityOrder = { high: 2, medium: 1, low: 0 };
        return sort.direction === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'createdAt':
        return sort.direction === 'asc'
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      case 'manual':
        return sort.direction === 'asc'
          ? (a.order || 0) - (b.order || 0)
          : (b.order || 0) - (a.order || 0);
      default:
        return 0;
    }
  });
};