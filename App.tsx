import React from 'react';
import Header from './components/layout/Header';
import TodoForm from './components/todo/TodoForm';
import TodoList from './components/todo/TodoList';
import TodoFilter from './components/todo/TodoFilter';
import TodoStats from './components/todo/TodoStats';
import { TodoProvider } from './context/TodoContext';

function App() {
  const [showStats, setShowStats] = React.useState(false);
  
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Background image overlay */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5 pointer-events-none transition-opacity duration-200"
          style={{
            backgroundImage: `url(${window.__theme?.background})`,
            display: window.__theme?.background ? 'block' : 'none',
          }}
        />

        <Header toggleStats={() => setShowStats(true)} />
        
        <main className="container mx-auto px-4 py-6 max-w-3xl relative">
          <TodoForm />
          <TodoFilter />
          <TodoList />
        </main>
        
        {showStats && <TodoStats onClose={() => setShowStats(false)} />}
      </div>
    </TodoProvider>
  );
}

export default App;