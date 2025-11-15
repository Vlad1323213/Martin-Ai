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
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-gray-500 text-sm">Нет писем для отображения</p>
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




