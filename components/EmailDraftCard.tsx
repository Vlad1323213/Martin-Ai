'use client'

import { useState } from 'react'
import { Email, CheckCircle, Send as SendIcon, Close } from '@mui/icons-material'

interface EmailDraftCardProps {
  to: string
  subject: string
  body: string
  onSend?: () => void
  onCancel?: () => void
}

export default function EmailDraftCard({ to, subject, body, onSend, onCancel }: EmailDraftCardProps) {
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSent(true)
    setTimeout(() => onSend?.(), 500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-md hover:shadow-lg transition-all animate-slide-up">
      {/* Получатель */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 font-medium">Кому</span>
          <div className="bg-gray-100 rounded-full px-3 py-1">
            <span className="text-sm text-gray-700 font-medium">{to}</span>
          </div>
        </div>
      </div>

      {/* Содержимое письма */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
        {subject && (
          <p className="text-sm font-semibold text-gray-900 mb-2">{subject}</p>
        )}
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{body}</p>
      </div>

      {/* Кнопки и статус */}
      {!sent ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleSend}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <SendIcon sx={{ fontSize: 18 }} />
            Отправить
          </button>
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
          <button className="w-12 h-11 flex items-center justify-center bg-green-500 rounded-xl hover:bg-green-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle sx={{ fontSize: 18 }} />
          <span className="text-sm font-medium">Письмо отправлено</span>
        </div>
      )}
    </div>
  )
}

