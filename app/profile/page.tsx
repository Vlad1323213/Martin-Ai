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
  ChevronRight
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
        email: 'Базовый',
        location: 'Не указано'
      })
    }
    
    // Проверяем подключение Google
    const checkGoogle = async () => {
      if (user?.id) {
        const response = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
        const data = await response.json()
        setIsGoogleConnected(data.connected)
        
        // Обновляем email если подключен
        if (data.connected && data.tokens?.email) {
          setProfileData(prev => ({ ...prev, email: data.tokens.email }))
        }
      }
    }
    
    checkGoogle()
  }, [user])

  const handleLogout = async () => {
    // Выход из Google
    try {
      // Если есть user id, очищаем токены на сервере
      if (user?.id) {
        await fetch(`/api/tokens?userId=${user.id}&provider=google`, {
          method: 'DELETE'
        })
      }
      
      // Очищаем локальные данные Google
      localStorage.removeItem('googleTokens')
      localStorage.removeItem('userSession')
      localStorage.removeItem('chatHistory')
      
      // Показываем уведомление
      alert('Вы вышли из Google аккаунта')
      
      // Перезагружаем приложение
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      alert('Ошибка при выходе из аккаунта')
    }
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
      value: profileData.email || 'Базовый',
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowBack sx={{ fontSize: 24, color: '#1f2937' }} />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Профиль</h1>
          
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Logout sx={{ fontSize: 24, color: '#ef4444' }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Profile Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            ПРОФИЛЬ
          </h2>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {profileItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{item.value}</span>
                  <ChevronRight sx={{ fontSize: 18, color: '#9ca3af' }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            ИНСТРУМЕНТЫ
          </h2>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {toolItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className={`text-sm ${
                      item.type === 'pro' ? 'text-blue-500 font-medium' : 'text-gray-500'
                    }`}>
                      {item.value}
                    </span>
                  )}
                  <ChevronRight sx={{ fontSize: 18, color: '#9ca3af' }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            ИНТЕГРАЦИИ
          </h2>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <button 
              onClick={async () => {
                // Проверяем подключение
                const response = await fetch(`/api/tokens?userId=${user?.id || 'default'}&provider=google`)
                const data = await response.json()
                
                if (!data.connected) {
                  // Если не подключен - переходим на страницу авторизации
                  router.push('/settings')
                }
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500" />
                <span className="text-sm text-gray-900">Google</span>
              </div>
              <div className="flex items-center gap-2">
                {isGoogleConnected ? (
                  <>
                    <span className="text-sm text-green-600 font-medium">Подключено</span>
                    <ChevronRight sx={{ fontSize: 18, color: '#9ca3af' }} />
                  </>
                ) : (
                  <>
                    <span className="text-sm text-blue-600 font-medium">Подключить</span>
                    <ChevronRight sx={{ fontSize: 18, color: '#3b82f6' }} />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  )
}
