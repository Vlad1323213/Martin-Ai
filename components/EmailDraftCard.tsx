'use client'

import { useState, useEffect } from 'react'
import { Send, Close } from '@mui/icons-material'

interface EmailDraftCardProps {
  to: string
  cc?: string
  from?: string
  subject: string
  body: string
  onSend?: (to: string, subject: string, body: string) => void
  onCancel?: () => void
}

export default function EmailDraftCard({ 
  to: initialTo, 
  cc,
  from = 'user@gmail.com',
  subject: initialSubject, 
  body: initialBody, 
  onSend, 
  onCancel 
}: EmailDraftCardProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [to, setTo] = useState(initialTo)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  const handleSend = async () => {
    setIsSending(true)
    setTimeout(() => {
      onSend?.(to, subject, body)
      setIsSending(false)
    }, 1000)
  }

  return (
    <div 
      className={`w-full max-w-full transition-all duration-500 ${
        showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-gray-900 text-white rounded-2xl overflow-hidden shadow-xl">
        {/* Заголовок письма */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">To</span>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 bg-gray-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="recipient@example.com"
              />
            </div>
            {cc && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Cc</span>
                <span className="text-sm text-gray-300">{cc}</span>
              </div>
            )}
            {from && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">From</span>
                <span className="text-sm text-gray-300">{from}</span>
              </div>
            )}
          </div>
        </div>

        {/* Тема письма */}
        <div className="px-4 py-2 border-b border-gray-800">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent text-white text-base font-medium focus:outline-none"
            placeholder="Subject"
          />
        </div>

        {/* Тело письма */}
        <div className="px-4 py-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-transparent text-gray-100 text-sm focus:outline-none resize-none"
            rows={6}
            placeholder="Type your message..."
          />
        </div>

        {/* Кнопки действий */}
        <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-2">
          <button
            onClick={handleSend}
            disabled={isSending || !to || !subject || !body}
            className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Send
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-700 active:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}