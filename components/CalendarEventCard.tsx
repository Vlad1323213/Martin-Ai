'use client'

import { CalendarEvent } from '@/types'
import { Card, CardContent, Chip } from '@mui/material'
import { CalendarMonth, LocationOn, AccessTime } from '@mui/icons-material'
import { formatDateRange } from '@/utils/date'

interface CalendarEventCardProps {
  event: CalendarEvent
  onClick?: () => void
}

export default function CalendarEventCard({
  event,
  onClick,
}: CalendarEventCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:bg-opacity-80 transition-all mb-2"
      sx={{
        bgcolor: '#1c1c1e',
        border: '1px solid #2c2c2e',
        '&:hover': {
          bgcolor: '#252527',
        },
      }}
    >
      <CardContent className="!p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ backgroundColor: '#007aff20' }}
          >
            <CalendarMonth sx={{ color: '#007aff', fontSize: 24 }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-[15px] mb-1">
              {event.title}
            </h3>

            <div className="flex items-center gap-1 text-telegram-secondary text-[13px] mb-1">
              <AccessTime sx={{ fontSize: 14 }} />
              <span>{formatDateRange(event.startTime, event.endTime)}</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-1 text-telegram-secondary text-[13px] mb-2">
                <LocationOn sx={{ fontSize: 14 }} />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {event.description && (
              <p className="text-telegram-secondary text-[13px] line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}








