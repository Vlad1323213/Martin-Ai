'use client'

import { IconButton } from '@mui/material'
import { Person, Notifications } from '@mui/icons-material'
import WLogo from './WLogo'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onNotificationClick?: () => void
}

export default function Header({ onNotificationClick }: HeaderProps) {
  const router = useRouter()
  const [hasNotifications, setHasNotifications] = useState(false)

  useEffect(() => {
    // Проверяем есть ли новые уведомления
    const checkNotifications = () => {
      const unreadCount = localStorage.getItem('unreadNotifications')
      setHasNotifications(unreadCount ? parseInt(unreadCount) > 0 : false)
    }
    
    checkNotifications()
    const interval = setInterval(checkNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-gray-200">
      {/* Кнопка профиля слева */}
      <IconButton 
        onClick={() => router.push('/profile')}
        sx={{ color: '#1f2937', padding: { xs: '6px', sm: '8px' } }}
      >
        <Person sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </IconButton>

      {/* Логотип по центру */}
      <div className="flex-1 flex items-center justify-center">
        <WLogo size={40} />
      </div>

      {/* Кнопка уведомлений справа */}
      <div className="relative">
        <IconButton 
          onClick={onNotificationClick}
          sx={{ color: '#1f2937', padding: { xs: '6px', sm: '8px' } }}
        >
          <Notifications sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
        {hasNotifications && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  )
}