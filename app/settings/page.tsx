'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowBack, Google } from '@mui/icons-material'
import { useTelegram } from '@/hooks/useTelegram'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useTelegram()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Проверяем подключение при загрузке
    checkConnection()
  }, [user])

  const checkConnection = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
      const data = await response.json()
      setIsConnected(data.connected === true)
    } catch (error) {
      console.error('Error checking connection:', error)
      setIsConnected(false)
    }
  }

  const handleGoogleConnect = async () => {
    if (!user?.id) {
      alert('Ошибка: не удалось получить ID пользователя')
      return
    }

    setIsConnecting(true)
    
    // Для демо версии - симулируем подключение
    // В реальном приложении нужен настоящий Google OAuth
    const isDemoMode = !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
                      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID'
    
    if (isDemoMode) {
      // Демо режим - симулируем успешное подключение
      alert('Демо режим: для реального подключения Google требуется настройка OAuth.\n\nСм. файл GOOGLE_OAUTH_SETUP.md для инструкций.')
      
      // Симулируем сохранение токенов для демо
      const demoTokens = {
        access_token: 'demo_access_token',
        refresh_token: 'demo_refresh_token',
        email: user?.username ? `${user.username}@gmail.com` : 'user@gmail.com'
      }
      
      // Сохраняем демо токены
      await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          provider: 'google',
          tokens: demoTokens
        })
      })
      
      setIsConnected(true)
      setIsConnecting(false)
      
      // Перенаправляем обратно в профиль
      setTimeout(() => router.push('/profile'), 1000)
      return
    }
    
    try {
      // Реальное подключение Google OAuth
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri: `${window.location.origin}/api/auth/google/callback`,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.events email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: user.id.toString()
      })

      // Перенаправляем на Google OAuth
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    } catch (error) {
      console.error('Error connecting Google:', error)
      alert('Ошибка при подключении Google')
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!user?.id) return
    
    try {
      await fetch(`/api/tokens?userId=${user.id}&provider=google`, {
        method: 'DELETE'
      })
      
      setIsConnected(false)
      alert('Google аккаунт отключен')
      
      // Перенаправляем на главную
      router.push('/')
    } catch (error) {
      console.error('Error disconnecting:', error)
      alert('Ошибка при отключении')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowBack sx={{ fontSize: 24, color: '#000000' }} />
          </button>
          
          <h1 className="text-lg font-semibold text-black">
            Настройки
          </h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Google Integration Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6">
              {/* Google Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-center mb-2">
                Google Интеграция
              </h2>
              
              {/* Description */}
              <p className="text-sm text-gray-600 text-center mb-6">
                {isConnected 
                  ? 'Ваш Google аккаунт подключен. Вы можете управлять почтой и календарем.'
                  : 'Подключите Google для доступа к почте и календарю'
                }
              </p>

              {/* Button */}
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                >
                  Отключить Google
                </button>
              ) : (
                <button
                  onClick={handleGoogleConnect}
                  disabled={isConnecting}
                  className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    <>
                      <Google sx={{ fontSize: 20 }} />
                      Подключить Google
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Что дает подключение Google?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Чтение и отправка писем через Gmail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Создание и управление событиями в календаре</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Умные напоминания о важных событиях</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>AI анализ вашей почты</span>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push('/profile')}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Вернуться в профиль
          </button>
        </div>
      </div>
    </div>
  )
}
