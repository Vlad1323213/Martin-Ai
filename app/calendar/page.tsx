'use client'

import { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import { ArrowBack, Add, Refresh } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import Calendar from '@/components/Calendar'
import CalendarEventCard from '@/components/CalendarEventCard'
import { CalendarEvent } from '@/types'
import { useTelegram } from '@/hooks/useTelegram'

export default function CalendarPage() {
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useTelegram()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      fetchEvents()
    }
  }, [mounted, user])

  const fetchEvents = async () => {
    if (!user) {
      console.log('❌ No user ID available')
      return
    }
    
    console.log('🔍 Fetching events for user:', user.id)
    
    try {
      setLoading(true)
      
      // Получаем токены с сервера
      const tokensResponse = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
      const tokensData = await tokensResponse.json()
      
      console.log('📊 Tokens response:', tokensData)
      
      if (!tokensData.connected) {
        console.log('❌ Google not connected - showing demo events')
        // Показываем демо события чтобы видеть что календарь работает
        setEvents([
          {
            id: 'demo1',
            title: '⚠️ Google не подключен',
            description: 'Подключите Google в настройках чтобы видеть реальные события',
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000),
            location: '',
          },
        ])
        return
      }
      
      console.log('✅ Google connected, fetching calendar events...')
      
      const tokens = tokensData.tokens
      
      // Используем API ключ если нет токена OAuth
      const apiParam = tokens 
        ? `accessToken=${tokens.access_token}` 
        : ''

      const response = await fetch(`/api/calendar${apiParam ? '?' + apiParam : ''}`)
      const data = await response.json()
      
      if (data.error) {
        console.error('Calendar API Error:', data.error)
        
        // Проверяем если API заблокирован - показываем mock данные
        if (data.error.includes('blocked') || data.error.includes('disabled')) {
          console.warn('Calendar API заблокирован, используем демо данные')
          setEvents([
            {
              id: 'demo1',
              title: 'Встреча с командой',
              description: 'Еженедельная встреча по проекту',
              startTime: new Date(Date.now() + 86400000),
              endTime: new Date(Date.now() + 90000000),
              location: 'Zoom',
            },
            {
              id: 'demo2',
              title: 'Прием у врача',
              description: 'Плановый осмотр',
              startTime: new Date(Date.now() + 3 * 86400000),
              endTime: new Date(Date.now() + 3 * 86400000 + 1800000),
              location: 'Медицинский центр',
            },
            {
              id: 'demo3',
              title: 'Дедлайн проекта',
              description: 'Финальная сдача',
              startTime: new Date(Date.now() + 5 * 86400000),
              endTime: new Date(Date.now() + 5 * 86400000 + 3600000),
              location: '',
            },
          ])
          return
        }
        
        setEvents([
          {
            id: '1',
            title: 'Ошибка загрузки',
            description: data.error,
            startTime: new Date(),
            endTime: new Date(),
            location: 'Проверьте настройки API',
          },
        ])
        return
      }
      
      if (data.events) {
        setEvents(data.events.map((e: any) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime),
        })))
      }
    } catch (error: any) {
      console.error('Failed to fetch events:', error)
      
      // Fallback на demo данные при любой ошибке
      console.warn('Ошибка загрузки, используем демо данные')
      setEvents([
        {
          id: 'demo1',
          title: 'Встреча с командой',
          description: 'Еженедельная встреча по проекту',
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          location: 'Zoom',
        },
        {
          id: 'demo2',
          title: 'Прием у врача',
          description: 'Плановый осмотр',
          startTime: new Date(Date.now() + 3 * 86400000),
          endTime: new Date(Date.now() + 3 * 86400000 + 1800000),
          location: 'Медицинский центр',
        },
        {
          id: 'demo3',
          title: 'Дедлайн проекта',
          description: 'Финальная сдача',
          startTime: new Date(Date.now() + 5 * 86400000),
          endTime: new Date(Date.now() + 5 * 86400000 + 3600000),
          location: '',
        },
      ])
    } finally {
      setLoading(false)
    }
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

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="flex flex-col h-screen w-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-telegram-bg border-b border-white/[0.08]">
        <IconButton 
          onClick={() => router.back()}
          sx={{ color: 'white', padding: { xs: '6px', sm: '8px' } }}
        >
          <ArrowBack sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>

        <h1 className="text-white text-lg font-semibold">Календарь</h1>

        <div className="flex items-center gap-1">
          <IconButton 
            onClick={fetchEvents}
            disabled={loading}
            sx={{ color: 'white', padding: { xs: '6px', sm: '8px' } }}
          >
            <Refresh sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
          <IconButton sx={{ color: 'white', padding: { xs: '6px', sm: '8px' } }}>
            <Add sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Calendar */}
        <div className="mb-4">
          <Calendar 
            events={events}
            onDateClick={(date) => setSelectedDate(date)}
            onEventClick={(event) => console.log('Event clicked:', event)}
          />
        </div>

        {/* Events for selected date */}
        {selectedDate && (
          <div className="animate-fade-in">
            <div className="mb-3">
              <h2 className="text-white text-base font-semibold mb-1">
                {selectedDate.toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </h2>
              <p className="text-telegram-secondary text-sm">
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'событие' : 'событий'}
              </p>
            </div>

            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <CalendarEventCard 
                  key={event.id} 
                  event={event}
                  onClick={() => console.log('Event clicked:', event)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-telegram-secondary text-sm">
                  Нет событий на эту дату
                </p>
              </div>
            )}
          </div>
        )}

        {/* All upcoming events */}
        {!selectedDate && events.length > 0 && (
          <div className="animate-fade-in">
            <div className="mb-3">
              <h2 className="text-white text-base font-semibold mb-1">
                Предстоящие события
              </h2>
              <p className="text-telegram-secondary text-sm">
                {events.length} событий
              </p>
            </div>

            {events.slice(0, 5).map((event) => (
              <CalendarEventCard 
                key={event.id} 
                event={event}
                onClick={() => console.log('Event clicked:', event)}
              />
            ))}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-telegram-secondary text-base mb-2">
              Нет предстоящих событий
            </p>
            <p className="text-telegram-secondary text-sm">
              Подключите Google Calendar в настройках
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

