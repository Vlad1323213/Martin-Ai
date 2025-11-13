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
        bg-white/[0.02] border border-white/[0.08] rounded-xl p-3 mb-2
        hover:bg-white/[0.04] active:bg-white/[0.06] 
        transition-all cursor-pointer
        ${email.unread ? 'border-[#007aff]/30' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {email.unread && (
            <div className="flex-shrink-0 w-2 h-2 bg-[#007aff] rounded-full" />
          )}
          <p className={`text-sm truncate ${email.unread ? 'text-white font-semibold' : 'text-white/80 font-medium'}`}>
            {email.from}
          </p>
        </div>
        <span className="text-xs text-telegram-secondary flex-shrink-0">
          {getRelativeTime(email.timestamp)}
        </span>
      </div>

      <h4 className={`text-[13px] mb-1 truncate ${email.unread ? 'text-white font-medium' : 'text-white/70'}`}>
        {email.subject}
      </h4>

      <p className="text-xs text-telegram-secondary line-clamp-2">
        {email.preview}
      </p>
    </div>
  )
}
