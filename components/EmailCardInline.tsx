'use client'

import { EmailItem } from '@/types'
import { getRelativeTime } from '@/utils/date'

interface EmailCardInlineProps {
  email: EmailItem
  onClick?: () => void
}

export default function EmailCardInline({ email, onClick }: EmailCardInlineProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded-xl p-3 mb-2
        hover:bg-gray-50 active:bg-gray-100 
        transition-all cursor-pointer shadow-sm hover:shadow-md
        ${email.unread ? 'border-blue-200 bg-blue-50' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {email.unread && (
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
          )}
          <p className={`text-sm truncate ${email.unread ? 'text-gray-900 font-semibold' : 'text-gray-700 font-medium'}`}>
            {email.from}
          </p>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {getRelativeTime(email.timestamp)}
        </span>
      </div>

      <h4 className={`text-[13px] mb-1 truncate ${email.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {email.subject}
      </h4>

      <p className="text-xs text-gray-500 line-clamp-2">
        {email.preview}
      </p>
    </div>
  )
}
