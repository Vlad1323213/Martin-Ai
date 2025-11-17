'use client'

import { ActionCard as ActionCardType } from '@/types'
import { Card, CardContent } from '@mui/material'
import {
  Message as MessageIcon,
  Notifications,
  Settings,
} from '@mui/icons-material'
import GmailIcon from './icons/GmailIcon'
import GoogleCalendarIcon from './icons/GoogleCalendarIcon'
import GoogleIcon from './icons/GoogleIcon'
import TodoIcon from './icons/TodoIcon'

interface ActionCardProps {
  action: ActionCardType
  onClick?: () => void
}

const iconMap = {
  calendar: GoogleCalendarIcon,
  email: GmailIcon,
  todo: TodoIcon,
  message: MessageIcon,
  reminder: Notifications,
  integrate: GoogleIcon,
  settings: Settings,
}

const iconColorMap = {
  calendar: '#4285F4',
  email: '#EA4335',
  todo: '#34c759',
  message: '#30d158',
  reminder: '#ff9500',
  integrate: '#4285F4',
  settings: '#8e8e93',
}

export default function ActionCard({ action, onClick }: ActionCardProps) {
  const Icon = iconMap[action.icon]
  const iconColor = iconColorMap[action.icon]
  
  const isGoogleIcon = ['calendar', 'email', 'integrate', 'todo'].includes(action.icon)

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:bg-opacity-80 transition-all active:scale-98 w-full"
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        '&:hover': {
          bgcolor: '#f9fafb',
          transform: 'scale(1.01)',
          borderColor: '#d1d5db',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        transition: 'all 0.2s',
        touchAction: 'manipulation',
      }}
    >
      <CardContent className="!p-3 sm:!p-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0"
            style={{ 
              backgroundColor: isGoogleIcon ? `${iconColor}15` : `${iconColor}15`,
              padding: isGoogleIcon ? '4px' : '0'
            }}
          >
            {isGoogleIcon ? (
              <Icon size={isGoogleIcon ? 20 : 24} />
            ) : (
              <Icon sx={{ color: iconColor, fontSize: { xs: 20, sm: 24 } }} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-medium text-[14px] sm:text-[15px] leading-tight mb-0.5">
              {action.title}
            </h3>
            {action.subtitle && (
              <p className="text-gray-500 text-[12px] sm:text-[13px] truncate">
                {action.subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

