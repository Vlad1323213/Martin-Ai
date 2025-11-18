'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Person, 
  Phone, 
  Email, 
  LocationOn,
  Notifications,
  Task,
  StickyNote2,
  Article,
  Mic,
  Alarm,
  CalendarMonth,
  Drafts,
  Psychology,
  Settings,
  Logout,
  ArrowBack,
  ChevronRight,
  Login,
  CheckCircle,
  Cancel
} from '@mui/icons-material'
import { useTelegram } from '@/hooks/useTelegram'

interface ProfileItem {
  icon: React.ReactNode
  label: string
  value: string
  type: 'basic' | 'pro'
  onClick?: () => void
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, webApp } = useTelegram()
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    location: ''
  })
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Загружаем сохраненные данные
    const saved = localStorage.getItem('userProfile')
    if (saved) {
      setProfileData(JSON.parse(saved))
    } else if (user) {
      // Используем данные из Telegram
      setProfileData({
        name: `${user.first_name} ${user.last_name || ''}`.trim(),
        phone: 'Базовый',
        email: 'Не подключен',
        location: 'Не указано'
      })
    }
    
    // Проверяем подключение Google
    checkGoogleConnection()
  }, [user])

  const checkGoogleConnection = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
        const data = await response.json()
        setIsGoogleConnected(data.connected === true)
        
        // Обновляем email если подключен
        if (data.connected && data.tokens?.email) {
          setProfileData(prev => ({ ...prev, email: data.tokens.email }))
        } else {
          setProfileData(prev => ({ ...prev, email: 'Не подключен' }))
        }
      } catch (error) {
        console.error('Error checking Google:', error)
        setIsGoogleConnected(false)
      }
    }
  }

  const handleGoogleLogout = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      // Удаляем токены на сервере
      await fetch(`/api/tokens?userId=${user.id}&provider=google`, {
        method: 'DELETE'
      })
      
      // Очищаем локальные данные Google
      localStorage.removeItem('googleTokens')
      
      // Обновляем состояние
      setIsGoogleConnected(false)
      setProfileData(prev => ({ ...prev, email: 'Не подключен' }))
      
      // Показываем уведомление
      alert('Вы вышли из Google аккаунта')
    } catch (error) {
      console.error('Logout error:', error)
      alert('Ошибка при выходе из аккаунта')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Переходим на страницу настроек для авторизации
    router.push('/settings')
  }

  const saveProfile = (data: typeof profileData) => {
    localStorage.setItem('userProfile', JSON.stringify(data))
    setProfileData(data)
  }

  const profileItems: ProfileItem[] = [
    {
      icon: <Person sx={{ fontSize: 20 }} />,
      label: 'Имя',
      value: profileData.name || 'Не указано',
      type: 'basic'
    },
    {
      icon: <Phone sx={{ fontSize: 20 }} />,
      label: 'Номер телефона',
      value: profileData.phone || 'Базовый',
      type: 'basic'
    },
    {
      icon: <Email sx={{ fontSize: 20 }} />,
      label: 'Email',
      value: profileData.email || 'Не подключен',
      type: 'basic'
    },
    {
      icon: <LocationOn sx={{ fontSize: 20 }} />,
      label: 'Местоположение',
      value: profileData.location || 'Не указано',
      type: 'basic'
    }
  ]

  const toolItems: ProfileItem[] = [
    {
      icon: <Notifications sx={{ fontSize: 20 }} />,
      label: 'Напоминания',
      value: 'Базовый',
      type: 'basic'
    },
    {
      icon: <Task sx={{ fontSize: 20 }} />,
      label: 'Задачи',
      value: 'Базовый',
      type: 'basic'
    },
    {
      icon: <StickyNote2 sx={{ fontSize: 20 }} />,
      label: 'Заметки',
      value: 'Базовый',
      type: 'basic'
    },
    {
      icon: <Article sx={{ fontSize: 20 }} />,
      label: 'Брифинги',
      value: 'Базовый',
      type: 'basic'
    },
    {
      icon: <Mic sx={{ fontSize: 20 }} />,
      label: 'Голос',
      value: 'Базовый',
      type: 'basic'
    },
    {
      icon: <Alarm sx={{ fontSize: 20 }} />,
      label: 'Будильники',
      value: 'Pro',
      type: 'pro'
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 20 }} />,
      label: 'Планирование',
      value: 'Pro',
      type: 'pro'
    },
    {
      icon: <Drafts sx={{ fontSize: 20 }} />,
      label: 'Черновики писем',
      value: 'Pro',
      type: 'pro'
    },
    {
      icon: <Psychology sx={{ fontSize: 20 }} />,
      label: 'Память',
      value: 'Pro',
      type: 'pro'
    },
    {
      icon: <Settings sx={{ fontSize: 20 }} />,
      label: 'Дополнительные настройки',
      value: '',
      type: 'basic'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header с градиентом */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <ArrowBack sx={{ fontSize: 24, color: '#1f2937' }} />
          </button>
          
          <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Профиль
          </h1>
          
          <div className="w-10" /> {/* Spacer для центрирования */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* User Avatar Section */}
        <div className="flex flex-col items-center py-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profileData.name?.charAt(0) || 'U'}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            {profileData.name || 'Пользователь'}
          </h2>
          <p className="text-sm text-gray-500">
            {profileData.email !== 'Не подключен' ? profileData.email : 'Email не подключен'}
          </p>
        </div>

        {/* Google Account Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Google Аккаунт
            </h3>
          </div>
          
          <div className="p-4">
            {isGoogleConnected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 p-0.5">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Подключено</p>
                      <p className="text-xs text-gray-500">{profileData.email}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleGoogleLogout}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Logout sx={{ fontSize: 18 }} />
                      Выйти из Google
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Cancel sx={{ fontSize: 20, color: '#9ca3af' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Не подключено</p>
                    <p className="text-xs text-gray-500">Подключите для полного функционала</p>
                  </div>
                </div>
                
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Login sx={{ fontSize: 18 }} />
                  Войти в Google
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
            Информация
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {profileItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{item.value}</span>
                  <ChevronRight sx={{ fontSize: 18, color: '#d1d5db' }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
            Инструменты
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {toolItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.type === 'pro' ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100'
                  }`}>
                    <div className={item.type === 'pro' ? 'text-blue-600' : 'text-gray-600'}>
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.type === 'pro' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.value}
                    </span>
                  )}
                  <ChevronRight sx={{ fontSize: 18, color: '#d1d5db' }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back to Chat Button */}
        <div className="pt-4 pb-8">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <ArrowBack sx={{ fontSize: 18 }} />
            Вернуться к чату
          </button>
        </div>
      </div>
    </div>
  )
}