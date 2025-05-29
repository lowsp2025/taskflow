import React, { useState } from 'react'
import { CalendarDaysIcon, FunnelIcon, ClockIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

function App() {
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('No Category')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">TaskFlow</h1>
        <span className="text-gray-600">0 pending</span>
      </header>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg mb-4">Add a new task...</h2>
        <div className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                className="border rounded p-2"
                placeholder="dd/mm/yyyy"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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

          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Sort by:</span>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <CalendarDaysIcon className="w-5 h-5" />
              Due Date
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <FunnelIcon className="w-5 h-5" />
              Priority
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ClockIcon className="w-5 h-5" />
              Creation Date
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ListBulletIcon className="w-5 h-5" />
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
          <div className="w-16 h-16 mb-4">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-sm">Your task list is empty. Start by creating a new task!</p>
        </div>
      </div>
    </div>
  )
}

export default App