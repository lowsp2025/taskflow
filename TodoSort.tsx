import React from 'react';
import { ArrowDownAZ, ArrowUpAZ, Calendar, Flag, Clock, GripVertical } from 'lucide-react';
import { useTodoContext } from '../../context/TodoContext';
import { SortOption, SortDirection } from '../../types';

const TodoSort: React.FC = () => {
  const { sort, dispatch } = useTodoContext();

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'dueDate', label: 'Due Date', icon: <Calendar size={16} /> },
    { value: 'priority', label: 'Priority', icon: <Flag size={16} /> },
    { value: 'createdAt', label: 'Creation Date', icon: <Clock size={16} /> },
    { value: 'manual', label: 'Manual', icon: <GripVertical size={16} /> },
  ];

  const handleSortChange = (option: SortOption) => {
    if (option === sort.option) {
      // Toggle direction if same option
      dispatch({
        type: 'SET_SORT',
        payload: { direction: sort.direction === 'asc' ? 'desc' : 'asc' },
      });
    } else {
      // Set new option with default direction
      dispatch({
        type: 'SET_SORT',
        payload: { option, direction: 'asc' },
      });
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
      <div className="flex gap-2">
        {sortOptions.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => handleSortChange(value)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              sort.option === value
                ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {icon}
            <span>{label}</span>
            {sort.option === value && (
              sort.direction === 'asc' ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TodoSort;