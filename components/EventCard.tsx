'use client'

import { Event, Place, CheckCircle } from '@mui/icons-material'

interface EventCardProps {
  title: string
  datetime: string
  location?: string
}

export default function EventCard({ title, datetime, location }: EventCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
      <h3 className="text-gray-900 font-semibold text-base mb-3">{title}</h3>

      <div className="flex items-center gap-2 mb-2 bg-gray-100 rounded-lg px-3 py-2">
        <Event sx={{ color: '#6b7280', fontSize: 16 }} />
        <span className="text-sm text-gray-700">{datetime}</span>
      </div>

      {location && (
        <div className="flex items-center gap-2 mb-3">
          <Place sx={{ color: '#6b7280', fontSize: 16 }} />
          <span className="text-sm text-gray-600">{location}</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} />
          Event added.
        </p>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
            <span className="text-blue-600 font-bold text-xs">31</span>
          </div>
        </div>
      </div>
    </div>
  )
}

