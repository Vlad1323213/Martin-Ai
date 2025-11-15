'use client'

import { useState, useEffect } from 'react'
import { IconButton, InputBase } from '@mui/material'
import { Send, Mic } from '@mui/icons-material'

interface InputBarProps {
  onSend: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function InputBar({
  onSend,
  placeholder = 'Написать Mortis',
  disabled = false,
}: InputBarProps) {
  const [value, setValue] = useState('')
  const [isUserActive, setIsUserActive] = useState(true) // Начинаем с true
  const [animationKey, setAnimationKey] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Устанавливаем mounted только на клиенте
    setMounted(true)
    
    let timeoutId: NodeJS.Timeout

    const handleUserActivity = () => {
      setIsUserActive(true)
      clearTimeout(timeoutId)
      // Анимация возвращается через 15 секунд после последнего взаимодействия
      timeoutId = setTimeout(() => {
        setIsUserActive(false)
        setAnimationKey(prev => prev + 1) // Перезапускаем анимацию
      }, 15000)
    }

    // Отслеживаем различные типы взаимодействия
    window.addEventListener('mousedown', handleUserActivity)
    window.addEventListener('touchstart', handleUserActivity)
    window.addEventListener('keydown', handleUserActivity)
    window.addEventListener('scroll', handleUserActivity)

    return () => {
      window.removeEventListener('mousedown', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      window.removeEventListener('scroll', handleUserActivity)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white">
      <div className="flex-1">
        <div 
          key={mounted ? animationKey : undefined}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 ${mounted && !isUserActive ? 'input-light-animated' : 'input-light-not-animated'}`}
        >
          <InputBase
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            multiline
            maxRows={3}
            fullWidth
            sx={{
              color: '#000000',
              fontSize: { xs: '14px', sm: '15px' },
              '& .MuiInputBase-input': {
                padding: 0,
                '&::placeholder': {
                  color: '#9ca3af',
                  opacity: 1,
                },
              },
            }}
          />
        
          {value.trim() ? (
            <IconButton
              onClick={handleSend}
              disabled={disabled}
              size="small"
              sx={{
                color: '#3b82f6',
                padding: '4px',
                minWidth: 0,
              }}
            >
              <Send sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              sx={{
                color: '#9ca3af',
                padding: '4px',
                minWidth: 0,
              }}
            >
              <Mic sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  )
}

