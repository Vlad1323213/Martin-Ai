'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Message, ActionCard } from '@/types'
import ChatMessage from '@/components/ChatMessage'
import InputBar from '@/components/InputBar'
import BottomBar from '@/components/BottomBar'
import Header from '@/components/Header'
import TypingIndicator from '@/components/TypingIndicator'
import SettingsModal from '@/components/SettingsModal'
import OnboardingScreen from '@/components/OnboardingScreen'
import { useTelegram } from '@/hooks/useTelegram'
import { parseCommand, generateResponse } from '@/lib/ai-parser'
import { getTokens } from '@/lib/oauth'

// Динамическое начальное сообщение создается в компоненте
const initialMessage: Message = {
  id: '1',
  type: 'assistant',
  content: "Привет! Я Mortis, ваш новый персональный AI-ассистент.\n\nЯ рад познакомиться и помочь вам! Что вас интересует?",
  timestamp: new Date('2025-01-01T00:00:00Z'),
  actions: [], // Заполнится динамически
}

export default function Home() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [isTyping, setIsTyping] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { webApp, user } = useTelegram()

  // Проверяем подключение Google и формируем actions
  useEffect(() => {
    const checkGoogleConnection = async () => {
      if (!user) {
        setCheckingConnection(false)
        return
      }

      try {
        const response = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
        const data = await response.json()
        
        if (!data.connected) {
          setShowOnboarding(true)
        } else {
          // Если подключен - формируем actions БЕЗ integrate
          const welcomeActions = [
            {
              id: 'email',
              title: 'Проверить непрочитанные письма',
              subtitle: 'Gmail',
              icon: 'email' as const,
              type: 'email' as const,
            },
            {
              id: 'todo',
              title: 'Создать список дел',
              subtitle: 'Планирование задач',
              icon: 'todo' as const,
              type: 'todo' as const,
            },
          ]
          
          setMessages([{
            ...initialMessage,
            actions: welcomeActions
          }])
        }
      } catch (error) {
        console.error('Error checking Google connection:', error)
      } finally {
        setCheckingConnection(false)
      }
    }

    if (user) {
      checkGoogleConnection()
    }
  }, [user])

  // Обработка OAuth redirect для Telegram Mini App
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const authSuccess = urlParams.get('auth_success')
      const tokensParam = urlParams.get('tokens')
      const expiryParam = urlParams.get('expiry')
      const provider = urlParams.get('provider')

      if (authSuccess === 'true' && tokensParam && expiryParam && provider) {
        try {
          const tokens = JSON.parse(decodeURIComponent(tokensParam))
          localStorage.setItem(`${provider}_tokens`, JSON.stringify(tokens))
          localStorage.setItem(`${provider}_tokens_expiry`, expiryParam)
          
          // Очищаем URL от параметров
          window.history.replaceState({}, '', '/')
          
          console.log(`${provider} auth success via redirect!`)
        } catch (e) {
          console.error('Error processing auth redirect:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Настройка Telegram WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.enableClosingConfirmation()
    }
  }, [webApp])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive (only if user is at bottom)
    const scrollContainer = document.querySelector('.overflow-y-auto')
    if (scrollContainer) {
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100
      if (isNearBottom || messages.length === 1) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [messages])

  // Swipe gesture удален - шторка почты больше не нужна

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Parse command
    const command = parseCommand(content)
    
    // Show typing
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // eslint-disable-next-line prefer-const
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      // Handle AI commands
      if (command.type === 'check_email') {
        if (!user) {
          assistantMessage.content = 'Ошибка: не удалось получить ID пользователя'
          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
          return
        }
        
        // Получаем токены с сервера
        const tokensResponse = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
        const tokensData = await tokensResponse.json()
        
        if (!tokensData.connected) {
          assistantMessage.content = 'Пожалуйста, подключите Gmail в настройках, чтобы я мог проверить вашу почту.'
          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
          return
        }
        
        const tokens = tokensData.tokens
        // Fetch real emails
        const unreadParam = command.params?.unreadOnly ? '&unreadOnly=true' : ''
        const response = await fetch(`/api/emails?accessToken=${tokens.access_token}&maxResults=5${unreadParam}`)
        const data = await response.json()
        
        if (data.emails && data.emails.length > 0) {
          assistantMessage.content = generateResponse(command, data)
          assistantMessage.emails = data.emails
        } else {
          assistantMessage.content = 'У вас нет новых писем.'
        }
      } else if (command.type === 'check_calendar') {
        if (!user) {
          assistantMessage.content = 'Ошибка: не удалось получить ID пользователя'
          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
          return
        }
        
        // Проверяем подключение
        const tokensResponse = await fetch(`/api/tokens?userId=${user.id}&provider=google`)
        const tokensData = await tokensResponse.json()
        
        if (!tokensData.connected) {
          assistantMessage.content = 'Пожалуйста, подключите Google Calendar в настройках.'
        } else {
          // Show calendar page
          assistantMessage.content = 'Открываю календарь...'
          setTimeout(() => router.push('/calendar'), 1000)
        }
      } else {
        // Default AI response
        assistantMessage.content = getAIResponse(content)
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleActionClick = async (actionId: string) => {
    const action = initialMessage.actions?.find((a) => a.id === actionId)
    if (!action) return

    // Специальная обработка для интеграции
    if (action.type === 'integrate') {
      setIsSettingsOpen(true)
      return
    }

    // Календарь через чат (не переход на страницу)
    if (action.type === 'calendar') {
      handleSendMessage('Покажи мои события на эту неделю')
      return
    }

    // Специальная обработка для email - проверяем реальную почту
    if (action.type === 'email') {
      handleSendMessage('Проверь непрочитанные письма')
      return
    }

    // Для остальных карточек - добавляем сообщения
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action.title,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    // Add assistant response based on action type
    const response = getActionResponse(action.type)
    setMessages((prev) => [...prev, response])
  }

  const handleAddTodo = async () => {
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Добавь задачу: забрать посылку и заблокировать 21:00-22:00 для чтения в библиотеке',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Показываем typing
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    // AI добавляет to-do карточку и событие
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Я успешно добавил "Забрать посылку" в ваш список дел. Также заблокировал 21:00 - 22:00 для "Чтение в библиотеке" в вашем календаре. Если нужно что-то еще, дайте знать!',
      timestamp: new Date(),
      todos: [
        { id: '1', text: 'Забрать посылку', completed: false }
      ],
      todoTitle: 'Забрать посылку',
      events: [
        {
          id: '1',
          title: 'Чтение в библиотеке',
          startTime: new Date(new Date().setHours(21, 0, 0, 0)),
          endTime: new Date(new Date().setHours(22, 0, 0, 0)),
          location: 'Библиотека',
        }
      ]
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleListTodos = async () => {
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Покажи мой список дел',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Показываем typing
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    // AI показывает список дел
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Вот ваш список дел:',
      timestamp: new Date(),
      todos: [
        { id: '1', text: 'Проверить квартальные отчеты', completed: true },
        { id: '2', text: 'Подготовить презентацию', completed: false },
        { id: '3', text: 'Позвонить в страховую', completed: false },
        { id: '4', text: 'Купить продукты', completed: false },
      ],
      todoTitle: 'Мои задачи на сегодня'
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleRemindMe = () => {
    handleSendMessage('Установи напоминание')
  }

  const handleReminder = () => {
    handleSendMessage('Установи напоминание')
  }

  // Показываем onboarding если Google не подключен
  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
  }

  // Показываем черный экран пока проверяем
  if (checkingConnection) {
    return (
      <div className="flex items-center justify-center h-screen bg-black" />
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 py-3 sm:py-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            onActionClick={handleActionClick}
            isLatest={index === messages.length - 1 && message.type === 'assistant'}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom section */}
      <div className="flex-shrink-0">
        <BottomBar
          onAddTodo={handleAddTodo}
          onListTodos={handleListTodos}
          onReminder={handleReminder}
        />
        <InputBar onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}

// Helper functions for AI responses
function getAIResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes('calendar') || lowerInput.includes('календарь') || lowerInput.includes('встреч') || lowerInput.includes('событи')) {
    return "Я проверил ваш календарь на эту неделю. У вас 3 предстоящих события:\n\n• Встреча с командой завтра в 14:00\n• Прием у врача в среду в 10:00\n• Дедлайн проекта в пятницу\n\nХотите добавить или изменить что-то?"
  }

  if (lowerInput.includes('email') || lowerInput.includes('почта') || lowerInput.includes('письм') || lowerInput.includes('сообщени')) {
    return "Я проверил ваши непрочитанные письма за сегодня. У вас 5 непрочитанных сообщений:\n\n• Обновление проекта от руководителя\n• Счет от поставщика\n• Рассылка новостей\n• Приглашение на встречу\n• Запрос от клиента\n\nХотите, чтобы я подробнее рассказал о каком-то из них?"
  }

  if (lowerInput.includes('todo') || lowerInput.includes('задач') || lowerInput.includes('дел') || lowerInput.includes('список') || lowerInput.includes('добав')) {
    return "Я создал ваш список дел на завтра:\n\n✓ Проверить квартальные отчеты\n✓ Подготовить презентацию\n✓ Позвонить в страховую компанию\n✓ Купить продукты\n✓ Тренировка в 18:00\n\nХотите что-то добавить или изменить?"
  }

  if (lowerInput.includes('remind') || lowerInput.includes('напомн') || lowerInput.includes('напоминан') || lowerInput.includes('установ')) {
    return "Конечно! О чем вам напомнить и когда?"
  }

  if (lowerInput.includes('привет') || lowerInput.includes('здравств') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Привет! Я Мартин, ваш AI-ассистент. Могу помочь с календарем, почтой и задачами. Что вас интересует?"
  }

  if (lowerInput.includes('помо') || lowerInput.includes('help')) {
    return "Я могу помочь вам с:\n\n📅 Календарем - посмотреть события, создать встречи\n✉️ Почтой - проверить письма, отправить сообщения\n✅ Задачами - создать списки дел, отметить выполненное\n🔔 Напоминаниями - установить уведомления\n\nПросто скажите, что вам нужно!"
  }

  return "Понял вас. Я здесь, чтобы помочь с календарем, почтой и задачами. Что бы вы хотели сделать?"
}

function getActionResponse(actionType: string): Message {
  const responses: Record<string, string> = {
    calendar:
      "Открываю ваш Google Calendar...",
    email:
      "Проверяю вашу почту Gmail...",
    todo:
      "Я создал ваш список дел на завтра:\n\n✓ Проверить квартальные отчеты\n✓ Подготовить презентацию\n✓ Позвонить в страховую\n✓ Купить продукты",
    message:
      "Я могу помочь отправить SMS. Какому контакту вы хотите написать?",
  }

  return {
    id: Date.now().toString(),
    type: 'assistant',
    content: responses[actionType] || "Работаю над этой функцией!",
    timestamp: new Date(),
  }
}

