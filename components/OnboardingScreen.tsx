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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-6">
      {/* Логотип */}
      <div className="mb-8 relative">
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/logo-new.jpg"
            alt="Martin AI"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Glow эффект */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl -z-10" />
      </div>

      {/* Заголовок */}
      <h1 className="text-4xl font-bold text-white mb-3 text-center">
        Добро пожаловать в{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Martin AI
        </span>
      </h1>

      {/* Подзаголовок */}
      <p className="text-gray-300 text-center mb-12 max-w-sm text-lg">
        Ваш персональный AI-ассистент для календаря, почты и задач
      </p>

      {/* Кнопка подключения Google */}
      <button
        onClick={handleConnectGoogle}
        disabled={connecting}
        className="w-full max-w-md bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {connecting ? 'Подключение...' : 'Продолжить с Google'}
      </button>

      {/* Описание */}
      <p className="text-gray-400 text-center text-sm max-w-md">
        Подключите Google аккаунт для доступа к Gmail, Google Calendar и другим сервисам
      </p>

      {/* Фичи */}
      <div className="mt-12 grid grid-cols-1 gap-4 max-w-md w-full">
        <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📧</span>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Управление почтой</h3>
            <p className="text-gray-400 text-sm">Проверяйте и читайте письма через AI</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Умный календарь</h3>
            <p className="text-gray-400 text-sm">Просматривайте встречи и события</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">AI-ассистент</h3>
            <p className="text-gray-400 text-sm">Общайтесь естественным языком</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 pb-6 text-center">
        <p className="text-gray-500 text-xs">
          Нажимая "Продолжить", вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  )
}

