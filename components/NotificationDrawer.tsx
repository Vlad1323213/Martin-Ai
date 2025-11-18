'use client'

import { useEffect, useState } from 'react'
import { Close, NotificationsNone, Task, CalendarMonth, Email } from '@mui/icons-material'

interface Notification {
  id: string
  type: 'task' | 'event' | 'email'
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Загружаем уведомления
    const loadNotifications = () => {
      const saved = localStorage.getItem('notifications')
      if (saved) {
        setNotifications(JSON.parse(saved))
      } else {
        // Демо уведомления
        setNotifications([
          {
            id: '1',
            type: 'task',
            title: 'Задача выполнена',
            message: 'Задача "Купить продукты" отмечена как выполненная',
            time: '5 мин назад',
            read: false
          },
          {
            id: '2',
            type: 'event',
            title: 'Напоминание о встрече',
            message: 'Встреча с командой через 30 минут',
            time: '30 мин назад',
            read: false
          },
          {
            id: '3',
            type: 'email',
            title: 'Новое письмо',
            message: 'Получено письмо от support@example.com',
            time: '1 час назад',
            read: true
          }
        ])
      }
    }
    
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
    
    // Обновляем счетчик непрочитанных
    const unreadCount = updated.filter(n => !n.read).length
    localStorage.setItem('unreadNotifications', unreadCount.toString())
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.removeItem('notifications')
    localStorage.setItem('unreadNotifications', '0')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Task sx={{ fontSize: 20, color: '#10b981' }} />
      case 'event':
        return <CalendarMonth sx={{ fontSize: 20, color: '#3b82f6' }} />
      case 'email':
        return <Email sx={{ fontSize: 20, color: '#8b5cf6' }} />
      default:
        return <NotificationsNone sx={{ fontSize: 20, color: '#6b7280' }} />
    }
  }

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${
      isOpen ? 'pointer-events-auto' : 'pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Уведомления</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close sx={{ fontSize: 20, color: '#6b7280' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <NotificationsNone sx={{ fontSize: 48, color: '#d1d5db' }} />
              <p className="mt-2 text-sm text-gray-500">Нет уведомлений</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={clearAll}
              className="w-full py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              Очистить все
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
