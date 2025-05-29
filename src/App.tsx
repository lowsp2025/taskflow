import React, { useState } from 'react'
import { Calendar, Filter, Clock, List, ClipboardList, Search } from 'lucide-react'
import clsx from 'clsx'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('No Category')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">TaskFlow</h1>
        <span className="text-gray-600">0 pending</span>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Add a new task...</h2>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 flex items-center gap-2">
            <span>Add</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                className="border rounded p-2"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <input
                type="time"
                className="border rounded p-2"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  className={clsx(
                    'px-3 py-1 rounded-full capitalize',
                    priority === p && {
                      'bg-green-100 text-green-700': p === 'low',
                      'bg-yellow-100 text-yellow-700': p === 'medium',
                      'bg-red-100 text-red-700': p === 'high',
                    },
                    priority !== p && 'bg-gray-100 text-gray-700'
                  )}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <select
              className="border rounded p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>No Category</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Sort by:</span>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Calendar className="w-5 h-5" />
              Due Date
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Filter className="w-5 h-5" />
              Priority
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Clock className="w-5 h-5" />
              Creation Date
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <List className="w-5 h-5" />
              Manual
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <select className="border rounded p-2">
            <option>All Priorities</option>
          </select>
          <select className="border rounded p-2">
            <option>All Categories</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Hide Completed
          </label>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <ClipboardList className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-sm">Your task list is empty. Start by creating a new task!</p>
        </div>
      </div>
    </div>
  )
}

export default App