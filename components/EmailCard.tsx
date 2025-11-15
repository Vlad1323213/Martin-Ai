'use client'

import { EmailItem } from '@/types'
import { Card, CardContent, Badge } from '@mui/material'
import { Email, Circle } from '@mui/icons-material'
import { getRelativeTime } from '@/utils/date'

interface EmailCardProps {
  email: EmailItem
  onClick?: () => void
}

export default function EmailCard({ email, onClick }: EmailCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:bg-opacity-80 transition-all mb-2"
      sx={{
        bgcolor: email.unread ? '#eff6ff' : '#ffffff',
        border: `1px solid ${email.unread ? '#bfdbfe' : '#e5e7eb'}`,
        '&:hover': {
          bgcolor: email.unread ? '#dbeafe' : '#f9fafb',
        },
      }}
    >
      <CardContent className="!p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ backgroundColor: '#3b82f615' }}
          >
            <Email sx={{ color: '#3b82f6', fontSize: 24 }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3
                className={`font-medium text-[15px] truncate ${
                  email.unread ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {email.from}
              </h3>
              {email.unread && (
                <Circle sx={{ color: '#3b82f6', fontSize: 10 }} />
              )}
            </div>

            <p
              className={`text-[14px] mb-1 truncate ${
                email.unread ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              {email.subject}
            </p>

            <p className="text-gray-500 text-[13px] line-clamp-2 mb-1">
              {email.preview}
            </p>

            <p className="text-gray-400 text-[12px]">
              {getRelativeTime(email.timestamp)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}








