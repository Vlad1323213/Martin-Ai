'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, RadioButtonUnchecked, MoreVert, CheckBox } from '@mui/icons-material'

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
  const [showAdded, setShowAdded] = useState(false)

  useEffect(() => {
    // Анимация появления статуса
    setTimeout(() => setShowAdded(true), 500)
  }, [])

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    onToggle?.(id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-md hover:shadow-lg transition-all animate-slide-up">
      {/* Заголовок с иконкой */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <CheckBox sx={{ color: '#10b981', fontSize: 18 }} />
          </div>
          <h3 className="text-gray-900 font-semibold text-base">• {title}</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVert sx={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Список задач */}
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className="flex items-center gap-2.5 cursor-pointer group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-110">
              {item.completed ? (
                <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
              ) : (
                <RadioButtonUnchecked sx={{ color: '#d1d5db', fontSize: 22 }} className="group-hover:text-gray-400" />
              )}
            </div>
            <span className={`text-sm font-medium transition-all ${
              item.completed ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Статус с анимацией */}
      <div className={`mt-4 pt-3 border-t border-gray-100 transition-all ${
        showAdded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="flex items-center gap-1.5">
          <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
          <p className="text-xs text-gray-600 font-medium">Задача добавлена</p>
        </div>
      </div>
    </div>
  )
}

