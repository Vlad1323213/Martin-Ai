'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import Image from 'next/image'

interface OnboardingScreenProps {
  onComplete: () => void
}

// Тексты вынесены наружу компонента
const textEndings = [
  'задач и встреч',
  'управления календарем',
  'работы с почтой',
  'повышения продуктивности',
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { user } = useTelegram()
  const [connecting, setConnecting] = useState(false)
  const [displayedText, setDisplayedText] = useState('Ваш помощник для ')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [animationStarted, setAnimationStarted] = useState(false)

  // Анимация печати и стирания текста (останавливается в конце)
  useEffect(() => {
    if (animationComplete) return

    // Задержка перед началом анимации
    if (!animationStarted) {
      const startDelay = setTimeout(() => {
        setAnimationStarted(true)
      }, 800)
      return () => clearTimeout(startDelay)
    }

    let currentIndex = 0
    let isDeleting = false
    const baseText = 'Ваш помощник для '
    const ending = textEndings[currentTextIndex]
    let timeoutId: NodeJS.Timeout
    const isLastText = currentTextIndex === textEndings.length - 1

    const animate = () => {
      if (!isDeleting) {
        // Печатаем окончание
        if (currentIndex <= ending.length) {
          setDisplayedText(baseText + ending.slice(0, currentIndex))
          currentIndex++
          timeoutId = setTimeout(animate, 70)
        } else {
          // Если это последний текст - останавливаемся
          if (isLastText) {
            setAnimationComplete(true)
            return
          }
          // Иначе - пауза перед стиранием
          timeoutId = setTimeout(() => {
            isDeleting = true
            animate()
          }, 1500)
        }
      } else {
        // Стираем окончание (оставляем "Ваш помощник для ")
        if (currentIndex > 0) {
          currentIndex--
          setDisplayedText(baseText + ending.slice(0, currentIndex))
          timeoutId = setTimeout(animate, 30)
        } else {
          // Переходим к следующему тексту
          timeoutId = setTimeout(() => {
            setCurrentTextIndex((prev) => prev + 1)
          }, 200)
        }
      }
    }

    animate()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [currentTextIndex, animationComplete, animationStarted])

  // Проверка подключения при возвращении в приложение
  useEffect(() => {
    if (!connecting || !user) return

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
    const timeoutId = setTimeout(() => {
      clearInterval(checkInterval)
      setConnecting(false)
    }, 300000)

    return () => {
      clearInterval(checkInterval)
      clearTimeout(timeoutId)
    }
  }, [connecting, user, onComplete])

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
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-black onboarding-screen-fade">
      {/* Градиент снизу - половина экрана */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="vibrant-gradient-bottom" />
      </div>

      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Логотип */}
        <div className="mb-8 relative onboarding-fade-in">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-0 shadow-none flex items-center justify-center bg-black p-3">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/logo-new.jpg"
                alt="Martin AI"
                width={56}
                height={56}
                className="object-contain border-0"
                priority
              />
            </div>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-5xl font-bold text-white mb-3 text-center onboarding-fade-in" style={{ animationDelay: '0.4s' }}>
          Привет, <span className="text-[#7dd3c0]">Martin</span>
        </h1>

        {/* Подзаголовок с анимацией печати и стирания */}
        <div className="text-gray-400 text-center mb-16 text-base min-h-[24px] onboarding-fade-in" style={{ animationDelay: '0.8s' }}>
          {displayedText}
          {!animationComplete && (
            <span className="inline-block w-0.5 h-4 bg-gray-400 ml-1 animate-pulse" />
          )}
        </div>

        {/* Контейнер с кнопкой */}
        <div className="w-full max-w-md bg-[#1c1c1e] rounded-3xl p-6 onboarding-fade-in" style={{ animationDelay: '1.2s' }}>
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
          {connecting ? 'Подключение...' : 'Продолжить с Google'}
        </button>

          {/* Описание */}
          <p className="text-gray-400 text-center text-sm">
            Создан для выполнения задач.
          </p>
        </div>
      </div>
    </div>
  )
}

