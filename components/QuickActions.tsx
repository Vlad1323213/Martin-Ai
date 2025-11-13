'use client'

import { IconButton } from '@mui/material'
import {
  CalendarMonth,
  Email,
  CheckCircleOutline,
  Notifications,
  Settings,
  Add,
} from '@mui/icons-material'

interface QuickActionsProps {
  onCalendar: () => void
  onEmail: () => void
  onTodos: () => void
  onReminders: () => void
  onSettings: () => void
  onAdd: () => void
}

export default function QuickActions({
  onCalendar,
  onEmail,
  onTodos,
  onReminders,
  onSettings,
  onAdd,
}: QuickActionsProps) {
  const actions = [
    { icon: CalendarMonth, label: 'Calendar', onClick: onCalendar, color: '#007aff' },
    { icon: Email, label: 'Email', onClick: onEmail, color: '#ff3b30' },
    { icon: CheckCircleOutline, label: 'Tasks', onClick: onTodos, color: '#34c759' },
    { icon: Notifications, label: 'Reminders', onClick: onReminders, color: '#ff9500' },
    { icon: Settings, label: 'Settings', onClick: onSettings, color: '#8e8e93' },
    { icon: Add, label: 'Add', onClick: onAdd, color: '#5ac8fa' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {actions.map((action, index) => {
        const Icon = action.icon
        return (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-telegram-card hover:bg-[#252527] transition-colors"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <Icon sx={{ color: action.color, fontSize: 24 }} />
            </div>
            <span className="text-white text-[12px] font-medium">
              {action.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}








