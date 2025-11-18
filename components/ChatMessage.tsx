'use client'

import { Message } from '@/types'
import ActionCard from './ActionCard'
import WLogo from './WLogo'
import TypewriterText from './TypewriterText'
import EmailListCard from './EmailListCard'
import EmailDraftCard from './EmailDraftCard'
import TodoCard from './TodoCard'
import EventCard from './EventCard'
import { useState, useEffect } from 'react'

interface ChatMessageProps {
  message: Message
  onActionClick?: (actionId: string) => void
  isLatest?: boolean
}

export default function ChatMessage({ message, onActionClick, isLatest = false }: ChatMessageProps) {
  const isAssistant = message.type === 'assistant'
  const isWelcomeMessage = message.id === '1' // Первое приветственное сообщение
  const [showActions, setShowActions] = useState(!isLatest || !isAssistant)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTypingComplete = () => {
    setShowActions(true)
    // Запускаем анимацию только для приветственного сообщения
    if (isWelcomeMessage && isLatest) {
      setTimeout(() => {
        setShowAnimation(true)
        // После завершения анимации показываем обводку
        setTimeout(() => {
          setAnimationComplete(true)
        }, 7000) // 7 секунд длительность анимации
      }, 200)
    }
  }

  return (
    <div className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 animate-slide-up ${!isAssistant ? 'justify-end' : ''}`}>
      {isAssistant && (
        <div className="flex-shrink-0 mt-0.5">
          <WLogo size={36} />
        </div>
      )}
      
      <div className={`flex flex-col ${isAssistant ? 'max-w-[95%]' : 'max-w-[82%]'} sm:max-w-[85%] ${!isAssistant ? 'items-end' : ''}`}>
        {/* Message bubble */}
        <div
          className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
            isAssistant
              ? 'bg-gray-100 text-gray-900 border border-gray-200'
              : 'bg-blue-500 text-white shadow-lg'
          }`}
        >
          <div className="text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {isAssistant && isLatest ? (
              <TypewriterText 
                text={message.content} 
                speed={25}
                onComplete={isWelcomeMessage ? handleTypingComplete : () => setShowActions(true)}
              />
            ) : (
              message.content
            )}
          </div>
        </div>

            {/* Email cards */}
            {message.emails && message.emails.length > 0 && showActions && (
              <div className="mt-2 sm:mt-3 w-full animate-fade-in">
                <EmailListCard emails={message.emails} />
              </div>
            )}

            {/* Action cards */}
            {message.actions && message.actions.length > 0 && showActions && (
              <div className="mt-2 sm:mt-3 space-y-2 w-full max-w-full animate-fade-in">
                {message.actions.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onClick={() => onActionClick?.(action.id)}
                  />
                ))}
              </div>
            )}

            {/* Todo card */}
            {message.todos && message.todos.length > 0 && showActions && (
              <div className="mt-2 sm:mt-3 w-full animate-fade-in">
                <TodoCard 
                  title={message.todoTitle || 'Pick up my package'}
                  todos={message.todos}
                />
              </div>
            )}

            {/* Event card */}
            {message.events && message.events.length > 0 && showActions && (
              <div className="mt-2 sm:mt-3 w-full animate-fade-in">
                {message.events.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    datetime={`${event.startTime.toLocaleDateString('ru-RU', { weekday: 'long' })} • ${event.startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${event.endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`}
                    location={event.location}
                  />
                ))}
              </div>
            )}

            {/* Email draft card */}
            {message.emailDraft && showActions && (
              <div className="mt-2 sm:mt-3 w-full animate-fade-in">
                <EmailDraftCard
                  to={message.emailDraft.to}
                  subject={message.emailDraft.subject}
                  body={message.emailDraft.body}
                  onSend={async (to, subject, body) => {
                    try {
                      // Получаем user id из localStorage или Telegram
                      const userSession = localStorage.getItem('userSession')
                      const userId = userSession ? JSON.parse(userSession).id : 'default'
                      
                      // Отправляем через API
                      const response = await fetch('/api/gmail/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, to, subject, body })
                      })
                      
                      if (response.ok) {
                        // Добавляем уведомление об успешной отправке
                        const notification = {
                          id: Date.now().toString(),
                          type: 'email' as const,
                          title: 'Письмо отправлено',
                          message: `Письмо успешно отправлено на ${to}`,
                          time: 'Только что',
                          read: false
                        }
                        
                        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
                        notifications.unshift(notification)
                        localStorage.setItem('notifications', JSON.stringify(notifications))
                        localStorage.setItem('unreadNotifications', notifications.filter((n: any) => !n.read).length.toString())
                        
                        // Скрываем карточку
                        message.emailDraft = undefined
                        window.location.reload() // Перезагружаем для обновления
                      } else {
                        alert('Ошибка при отправке письма')
                      }
                    } catch (error) {
                      console.error('Send error:', error)
                      alert('Не удалось отправить письмо')
                    }
                  }}
                  onCancel={() => {
                    message.emailDraft = undefined
                    window.location.reload() // Перезагружаем для скрытия карточки
                  }}
                />
              </div>
            )}
          </div>
    </div>
  )
}

