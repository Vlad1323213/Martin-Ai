'use client'

import { useState, useEffect } from 'react'
import { Message as MessageIcon, Send } from '@mui/icons-material'

interface SmsCardProps {
  to: string
  body: string
  onSend?: () => void
  onCancel?: () => void
  onEdit?: (to: string, body: string) => void
}

export default function SmsCard({ 
  to: initialTo, 
  body: initialBody, 
  onSend, 
  onCancel,
  onEdit 
}: SmsCardProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [to, setTo] = useState(initialTo)
  const [body, setBody] = useState(initialBody)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  const handleSend = async () => {
    setIsSending(true)
    // Анимация отправки
    setTimeout(() => {
      onSend?.()
      setIsSending(false)
    }, 1000)
  }

  const handleEdit = () => {
    onEdit?.(to, body)
  }

  return (
    <div 
      className={`w-full max-w-full transition-all duration-500 ${
        showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Заголовок с иконкой */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <MessageIcon sx={{ fontSize: 20, color: '#10b981' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">Текстовое сообщение</h3>
          </div>
        </div>

        {/* Поле получателя */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Кому</div>
          <input
            type="text"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              handleEdit()
            }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            placeholder="Номер телефона или имя"
          />
        </div>

        {/* Текст сообщения */}
        <div className="mb-4">
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              handleEdit()
            }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-300 resize-none"
            rows={4}
            placeholder="Текст сообщения"
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            disabled={isSending || !to || !body}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send sx={{ fontSize: 16 }} />
                Отправить
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            Отмена
          </button>
        </div>

        {/* Индикатор iMessage */}
        <div className="mt-3 flex justify-end">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <MessageIcon sx={{ fontSize: 24, color: 'white' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
