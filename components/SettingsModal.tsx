'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Button } from '@mui/material'
import { Close, Google, CheckCircle, Link as LinkIcon } from '@mui/icons-material'
import { useTelegram } from '@/hooks/useTelegram'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [googleConnected, setGoogleConnected] = useState(false)
  const [yandexConnected, setYandexConnected] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useTelegram()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      checkConnections()
    }
  }, [mounted, isOpen, user])

  // Проверяем подключения при открытии модалки
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isOpen && user) {
      // Проверяем сразу
      checkConnections()
      
      // И каждые 2 секунды (пока модалка открыта)
      interval = setInterval(() => {
        checkConnections()
      }, 2000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isOpen, user])

  const checkConnections = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/tokens/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id.toString() }),
      })
      
      const data = await response.json()
      setGoogleConnected(data.google || false)
      setYandexConnected(data.yandex || false)
      
      console.log('Connection status:', data)
    } catch (error) {
      console.error('Failed to check connections:', error)
    }
  }

  const handleConnectGoogle = () => {
    if (!user) {
      alert('Ошибка: не удалось получить ID пользователя')
      return
    }
    
    console.log('Opening Google OAuth for user:', user.id)
    
    // Открываем OAuth в внешнем браузере
    const telegramWebApp = (window as any).Telegram?.WebApp
    const authUrl = `${window.location.origin}/api/auth/google?userId=${user.id}`
    
    if (telegramWebApp) {
      // В Telegram Mini App
      telegramWebApp.openLink(authUrl)
      alert('Откроется браузер для входа в Google.\n\nПосле входа вернитесь в Telegram - аккаунт будет подключен автоматически.')
    } else {
      // В обычном браузере
      window.open(authUrl, '_blank')
    }
  }

  const handleConnectYandex = () => {
    const width = 600
    const height = 700
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    window.open(
      '/api/auth/yandex',
      'Yandex OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  const handleDisconnectGoogle = async () => {
    if (!user) return
    
    try {
      await fetch(`/api/tokens?userId=${user.id}&provider=google`, {
        method: 'DELETE',
      })
      setGoogleConnected(false)
      console.log('Google disconnected')
    } catch (error) {
      console.error('Failed to disconnect Google:', error)
    }
  }

  const handleDisconnectYandex = async () => {
    if (!user) return
    
    try {
      await fetch(`/api/tokens?userId=${user.id}&provider=yandex`, {
        method: 'DELETE',
      })
      setYandexConnected(false)
      console.log('Yandex disconnected')
    } catch (error) {
      console.error('Failed to disconnect Yandex:', error)
    }
  }

  if (!mounted) return null

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1c1c1e',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Подключение аккаунтов</span>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <div className="space-y-4">
          {/* Google */}
          <div className="p-4 rounded-xl bg-[#252527] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                  <Google sx={{ color: '#4285F4', fontSize: 28 }} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px]">Google</h3>
                  <p className="text-telegram-secondary text-[13px]">Gmail + Calendar</p>
                </div>
              </div>
              {googleConnected && (
                <CheckCircle sx={{ color: '#34c759', fontSize: 24 }} />
              )}
            </div>
            
            {googleConnected ? (
              <div>
                <div className="text-[#34c759] text-sm mb-2">✓ Подключено</div>
                <Button
                  onClick={handleDisconnectGoogle}
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: '#ff3b30',
                    borderColor: '#ff3b30',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#ff3b30',
                      bgcolor: 'rgba(255, 59, 48, 0.1)',
                    },
                  }}
                >
                  Отключить
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectGoogle}
                variant="contained"
                fullWidth
                startIcon={<LinkIcon />}
                sx={{
                  bgcolor: '#007aff',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#0051d5',
                  },
                }}
              >
                Подключить Google
              </Button>
            )}
          </div>

          {/* Yandex */}
          <div className="p-4 rounded-xl bg-[#252527] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Я</span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px]">Yandex</h3>
                  <p className="text-telegram-secondary text-[13px]">Почта + Календарь</p>
                </div>
              </div>
              {yandexConnected && (
                <CheckCircle sx={{ color: '#34c759', fontSize: 24 }} />
              )}
            </div>
            
            {yandexConnected ? (
              <div>
                <div className="text-[#34c759] text-sm mb-2">✓ Подключено</div>
                <Button
                  onClick={handleDisconnectYandex}
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: '#ff3b30',
                    borderColor: '#ff3b30',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#ff3b30',
                      bgcolor: 'rgba(255, 59, 48, 0.1)',
                    },
                  }}
                >
                  Отключить
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectYandex}
                variant="contained"
                fullWidth
                startIcon={<LinkIcon />}
                sx={{
                  bgcolor: '#007aff',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#0051d5',
                  },
                }}
              >
                Подключить Yandex
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="text-telegram-secondary text-xs text-center mt-4">
            <p>Для работы AI-ассистента с почтой и календарем</p>
            <p>необходимо подключить хотя бы один аккаунт</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

