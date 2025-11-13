'use client'

import { EmailItem } from '@/types'
import EmailCardInline from './EmailCardInline'

interface EmailListCardProps {
  emails: EmailItem[]
  onEmailClick?: (email: EmailItem) => void
}

export default function EmailListCard({ emails, onEmailClick }: EmailListCardProps) {
  if (emails.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-center">
        <p className="text-telegram-secondary text-sm">Нет писем для отображения</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {emails.map((email) => (
        <EmailCardInline
          key={email.id}
          email={email}
          onClick={() => onEmailClick?.(email)}
        />
      ))}
    </div>
  )
}




