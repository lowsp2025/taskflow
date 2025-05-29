import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { useTodoContext, useFilteredTodos } from '../../context/TodoContext';
import ThemeSelector from '../theme/ThemeSelector';

type HeaderProps = {
  toggleStats: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleStats }) => {
  const { todos, theme } = useTodoContext();
  const filteredTodos = useFilteredTodos();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for fixed header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate completion stats
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      className={`sticky top-0 z-10 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-white">TaskFlow</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {filteredTodos.filter((todo) => !todo.completed).length} pending
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-200">
              <span className="font-medium">{completionRate}%</span> complete
            </div>
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={toggleStats}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors"
            aria-label="View statistics"
          >
            <BarChart2 size={20} />
          </button>

          <ThemeSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;