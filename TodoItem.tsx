import React, { useState } from 'react';
import { Check, Calendar, Edit, Trash2, X, AlertCircle, GripVertical } from 'lucide-react';
import { Todo, Category, Tag } from '../../types';
import { useTodoContext } from '../../context/TodoContext';
import Button from '../ui/Button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItemProps {
  todo: Todo;
  category?: Category;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, category }) => {
  const { dispatch, tags, sort } = useTodoContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [editedTags, setEditedTags] = useState(todo.tags);

  // Sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle toggle completion
  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
  };

  // Handle delete todo
  const handleDelete = () => {
    dispatch({ type: 'REMOVE_TODO', payload: todo.id });
  };

  // Handle save edited todo
  const handleSave = () => {
    if (editedTitle.trim()) {
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          ...todo,
          title: editedTitle.trim(),
          description: editedDescription.trim() || undefined,
          tags: editedTags,
        },
      });
      setIsEditing(false);
    }
  };

  // Handle tag toggle
  const handleTagToggle = (tagId: string) => {
    const newTags = editedTags.includes(tagId)
      ? editedTags.filter((id) => id !== tagId)
      : [...editedTags, tagId];
    setEditedTags(newTags);
  };

  // Priority styles
  const priorityStyles = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const priorityIcon = {
    high: <AlertCircle size={14} className="text-red-600 dark:text-red-400" />,
  };

  // Due date indicator
  const isDueDateOverdue = todo.dueDate && new Date(todo.dueDate) < new Date();

  // Get tags for todo
  const todoTags = tags.filter((tag) => todo.tags.includes(tag.id));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-3 transition-all ${
        todo.completed
          ? 'opacity-75 dark:opacity-60'
          : 'hover:shadow-md dark:hover:border-gray-600'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-20"
            placeholder="Description (optional)"
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  editedTags.includes(tag.id)
                    ? 'ring-2 ring-offset-1'
                    : 'opacity-60'
                }`}
                style={{
                  backgroundColor: `${tag.color}33`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
              leftIcon={<X size={16} />}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              leftIcon={<Check size={16} />}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start">
          {sort.option === 'manual' && (
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 mr-2 cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500"
            >
              <GripVertical size={20} />
            </div>
          )}
          
          <div className="flex-shrink-0 mr-3 pt-1">
            <button
              onClick={handleToggleComplete}
              className={`w-5 h-5 rounded-full border ${
                todo.completed
                  ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
                  : 'border-gray-300 dark:border-gray-500'
              } flex items-center justify-center transition-colors`}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed && <Check size={12} className="text-white" />}
            </button>
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium text-base ${
                  todo.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-800 dark:text-white'
                }`}
              >
                {todo.title}
              </h3>

              <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
                  aria-label="Edit task"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 p-1"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {todo.description && (
              <p
                className={`mt-1 text-sm ${
                  todo.completed
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {todo.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {category && (
                <span
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: `${category.color}33`,
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
              )}

              {todoTags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: `${tag.color}33`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}

              <span
                className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  priorityStyles[todo.priority]
                }`}
              >
                {todo.priority === 'high' && (
                  <span className="mr-1">{priorityIcon.high}</span>
                )}
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>

              {todo.dueDate && (
                <span
                  className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
                    isDueDateOverdue
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}
                >
                  <Calendar size={12} />
                  <span>{formatDate(todo.dueDate)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;