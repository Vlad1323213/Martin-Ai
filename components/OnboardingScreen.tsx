'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import Image from 'next/image'

interface OnboardingScreenProps {
  onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { user } = useTelegram()
  const [connecting, setConnecting] = useState(false)

  const handleConnectGoogle = () => {
    if (!user) {
      alert('Ошибка: не удалось получить ID пользователя')
      return
    }

    setConnecting(true)
    
    // Открываем OAuth в внешнем браузере
    const telegramWebApp = (window as any).Telegram?.WebApp
    const authUrl = `${window.location.origin}/api/auth/google?userId=${user.id}`
    
    if (telegramWebApp) {
      // В Telegram Mini App
      telegramWebApp.openLink(authUrl)
    } else {
      // В обычном браузере
      window.open(authUrl, '_blank')
    }

    // Проверяем статус каждые 2 секунды
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
        const data = await response.json()
        
        if (data.connected) {
          clearInterval(checkInterval)
          setConnecting(false)
          onComplete()
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }, 2000)

    // Останавливаем проверку через 5 минут
    setTimeout(() => {
      clearInterval(checkInterval)
      setConnecting(false)
    }, 300000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      {/* Логотип */}
      <div className="mb-8 relative">
        <div className="relative w-28 h-28 rounded-3xl overflow-hidden">
          <Image
            src="/logo-new.jpg"
            alt="Martin AI"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Заголовок */}
      <h1 className="text-5xl font-bold text-white mb-3 text-center">
        Meet <span className="text-[#7dd3c0]">Martin</span>
      </h1>

      {/* Подзаголовок */}
      <p className="text-gray-400 text-center mb-16 text-base">
        Calendar meets intelligence.
      </p>

      {/* Контейнер с кнопками */}
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-3xl p-6 mb-8">
        {/* Кнопка Google */}
        <button
          onClick={handleConnectGoogle}
          disabled={connecting}
          className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {connecting ? 'Connecting...' : 'Continue with Google'}
        </button>

        {/* Кнопка Apple (заглушка) */}
        <button
          disabled
          className="w-full bg-[#2c2c2e] text-white/50 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 cursor-not-allowed mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple
        </button>

        {/* Описание */}
        <p className="text-gray-400 text-center text-sm">
          Designed to get things done.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-8 text-center">
        <p className="text-gray-600 text-xs">
          By continuing, you agree to our{' '}
          <span className="text-gray-500 underline">Terms of Service</span>
          {' · '}
          <span className="text-gray-500 underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

