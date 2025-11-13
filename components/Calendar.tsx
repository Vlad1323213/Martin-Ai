'use client'

import { useState } from 'react'
import { IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight, Add } from '@mui/icons-material'
import { CalendarEvent } from '@/types'

interface CalendarProps {
  events: CalendarEvent[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export default function Calendar({ events, onDateClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert to Mon-Sun (0-6)
    
    const days: (Date | null)[] = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="bg-[#0a0a0a] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <IconButton onClick={previousMonth} size="small" sx={{ color: 'white' }}>
          <ChevronLeft />
        </IconButton>
        
        <div className="text-white font-semibold text-base">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        
        <IconButton onClick={nextMonth} size="small" sx={{ color: 'white' }}>
          <ChevronRight />
        </IconButton>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 px-2 py-2 border-b border-white/[0.05]">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-telegram-secondary text-[11px] text-center font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dayEvents = getEventsForDate(day)
          const today = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className={`aspect-square rounded-lg p-1 transition-all relative ${
                today
                  ? 'bg-[#007aff] text-white font-semibold'
                  : 'hover:bg-white/[0.05] text-white'
              }`}
            >
              <div className="text-[13px]">{day.getDate()}</div>
              
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        today ? 'bg-white' : 'bg-[#007aff]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Events list for selected date */}
      {events.length > 0 && (
        <div className="border-t border-white/[0.08] p-3 max-h-48 overflow-y-auto">
          <div className="text-white text-sm font-medium mb-2">Предстоящие события</div>
          <div className="space-y-2">
            {events.slice(0, 5).map(event => {
              const startTime = new Date(event.startTime)
              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-all"
                >
                  <div className="text-white text-[13px] font-medium mb-0.5">
                    {event.title}
                  </div>
                  <div className="text-telegram-secondary text-[11px]">
                    {startTime.toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}




