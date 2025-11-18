'use client'

import { useState, useEffect } from 'react'
import { Event, Place, CheckCircle, CalendarMonth } from '@mui/icons-material'

interface EventCardProps {
  title: string
  datetime: string
  location?: string
}

export default function EventCard({ title, datetime, location }: EventCardProps) {
  const [showAdded, setShowAdded] = useState(false)

  useEffect(() => {
    // Анимация появления статуса
    setTimeout(() => setShowAdded(true), 600)
  }, [])

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-md hover:shadow-lg transition-all animate-slide-up">
      {/* Заголовок */}
      <h3 className="text-gray-900 font-bold text-base mb-3">{title}</h3>

      {/* Время с иконкой */}
      <div className="flex items-center gap-2.5 mb-2.5 bg-gray-100 rounded-xl px-3.5 py-2.5">
        <Event sx={{ color: '#3b82f6', fontSize: 18 }} />
        <span className="text-sm text-gray-800 font-medium">{datetime}</span>
      </div>

      {/* Место */}
      {location && (
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <Place sx={{ color: '#6b7280', fontSize: 18 }} />
          </div>
          <span className="text-sm text-gray-600 font-medium">{location}</span>
        </div>
      )}

      {/* Статус с Google Calendar иконкой */}
      <div className={`mt-4 pt-3 border-t border-gray-100 flex items-center justify-between transition-all ${
        showAdded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="flex items-center gap-1.5">
          <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
          <p className="text-xs text-gray-600 font-medium">Событие добавлено</p>
        </div>
        
        {/* Иконка Google Calendar */}
        <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#1a73e8" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            <path fill="#ea4335" d="M7 10h5v5H7z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

