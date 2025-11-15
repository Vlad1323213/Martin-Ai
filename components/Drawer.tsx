'use client'

import { useState, useEffect, useRef } from 'react'
import { IconButton } from '@mui/material'
import { Close, Email } from '@mui/icons-material'
import EmailCard from './EmailCard'
import { EmailItem } from '@/types'
import { useTelegram } from '@/hooks/useTelegram'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  onRefresh?: () => void
}

export default function Drawer({ isOpen, onClose, onRefresh }: DrawerProps) {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [loading, setLoading] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { user } = useTelegram()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && mounted && user) {
      fetchEmails()
    }
  }, [isOpen, mounted, user])

  const fetchEmails = async () => {
    if (!user) {
      console.log('No user ID available')
      return
    }
    
    try {
      setLoading(true)
      
      // Получаем токены с сервера
      const tokensResponse = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
      const tokensData = await tokensResponse.json()
      
      if (!tokensData.connected) {
        // Mock data если не подключен
        setEmails([
          {
            id: '1',
            from: 'Подключите аккаунт',
            subject: 'Чтобы видеть реальные письма',
            preview: 'Нажмите на иконку Settings и подключите Google',
            unread: true,
            timestamp: new Date(),
          },
        ])
        return
      }
      
      const tokens = tokensData.tokens
      const response = await fetch(`/api/emails?accessToken=${tokens.access_token}&maxResults=10`)
      const data = await response.json()
      
      if (data.emails) {
        setEmails(data.emails)
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setTouchCurrent(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    setTouchCurrent(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart === null || touchCurrent === null) return

    const distance = touchStart - touchCurrent
    const threshold = 100 // минимальная дистанция для закрытия

    if (distance > threshold) {
      onClose()
    }

    setTouchStart(null)
    setTouchCurrent(null)
  }

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Блокировка скролла body когда drawer открыт
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const translateX = touchStart !== null && touchCurrent !== null 
    ? Math.min(0, touchCurrent - touchStart) 
    : 0

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          transform: isOpen 
            ? `translateX(${translateX}px)` 
            : 'translateX(-100%)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Email sx={{ color: '#3b82f6', fontSize: 24 }} />
            <h2 className="text-gray-900 text-lg font-semibold">Почта</h2>
          </div>
          <IconButton onClick={onClose} sx={{ color: '#1f2937', padding: '8px' }}>
            <Close sx={{ fontSize: 24 }} />
          </IconButton>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-60px)] px-4 py-4 bg-gray-50">
          <div className="animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 text-sm font-medium mb-1">
                  Входящие
                </h3>
                <p className="text-gray-500 text-xs">
                  {emails.filter(e => e.unread).length} непрочитанных
                </p>
              </div>
              <button
                onClick={fetchEmails}
                disabled={loading}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                {loading ? 'Загрузка...' : 'Обновить'}
              </button>
            </div>
            {emails.map((email) => (
              <EmailCard key={email.id} email={email} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
