'use client'

import { Message } from '@/types'
import { Avatar } from '@mui/material'
import { Person } from '@mui/icons-material'
import ActionCard from './ActionCard'
import LogoStatic from './LogoStatic'
import TypewriterText from './TypewriterText'
import EmailListCard from './EmailListCard'
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
          <LogoStatic size={36} />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[82%] sm:max-w-[85%] ${!isAssistant ? 'items-end' : ''}`}>
        {/* Message bubble */}
        <div
          className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
            isAssistant
              ? (isWelcomeMessage && showAnimation && !animationComplete)
                ? 'ai-message-animated text-white'
                : 'ai-message-bordered text-white'
              : 'user-message-gradient text-white shadow-lg'
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
              <div className="mt-2 sm:mt-3 space-y-2 w-full animate-fade-in">
                {message.actions.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onClick={() => onActionClick?.(action.id)}
                  />
                ))}
              </div>
            )}
          </div>

      {!isAssistant && (
        <div className="flex-shrink-0 mt-0.5">
          <div 
            className="user-avatar-gradient flex items-center justify-center rounded-full"
            style={{
              width: '36px',
              height: '36px',
              boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)'
            }}
          >
            <Person sx={{ fontSize: 20, color: 'white' }} />
          </div>
        </div>
      )}
    </div>
  )
}

