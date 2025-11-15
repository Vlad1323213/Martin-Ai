'use client'

import { useState } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { CheckCircle, RadioButtonUnchecked, MoreVert } from '@mui/icons-material'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

interface TodoCardProps {
  title: string
  todos: TodoItem[]
  onToggle?: (id: string) => void
}

export default function TodoCard({ title, todos, onToggle }: TodoCardProps) {
  const [items, setItems] = useState(todos)

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    onToggle?.(id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-900 font-semibold text-base">• {title}</h3>
        <IconButton size="small" sx={{ color: '#9ca3af', padding: '4px' }}>
          <MoreVert sx={{ fontSize: 18 }} />
        </IconButton>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex-shrink-0">
              {item.completed ? (
                <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
              ) : (
                <RadioButtonUnchecked sx={{ color: '#d1d5db', fontSize: 20 }} className="group-hover:text-gray-400" />
              )}
            </div>
            <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <CheckCircle sx={{ fontSize: 14 }} />
          To-do added.
        </p>
      </div>
    </div>
  )
}

