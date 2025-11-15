'use client'

import { IconButton } from '@mui/material'
import {
  AddCircleOutline,
  FormatListBulleted,
  CalendarMonth,
} from '@mui/icons-material'

interface BottomBarProps {
  onAddTodo: () => void
  onListTodos: () => void
  onCalendar: () => void
}

export default function BottomBar({
  onAddTodo,
  onListTodos,
  onCalendar,
}: BottomBarProps) {
  return (
    <div className="overflow-x-auto overflow-y-hidden bg-white border-t border-gray-200 px-3 py-3 no-scrollbar">
      <div className="flex gap-2 sm:gap-2.5 min-w-max">
        <button
          onClick={onAddTodo}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-all text-[13px] sm:text-sm font-medium touch-manipulation shadow-sm hover:shadow-md whitespace-nowrap min-w-[140px] sm:min-w-[160px]"
        >
          <AddCircleOutline sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span>Добавить</span>
        </button>
        
        <button
          onClick={onListTodos}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-all text-[13px] sm:text-sm font-medium touch-manipulation shadow-sm hover:shadow-md whitespace-nowrap min-w-[140px] sm:min-w-[160px]"
        >
          <FormatListBulleted sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span>Список дел</span>
        </button>
        
        <button
          onClick={onCalendar}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-all text-[13px] sm:text-sm font-medium touch-manipulation shadow-sm hover:shadow-md whitespace-nowrap min-w-[140px] sm:min-w-[160px]"
        >
          <CalendarMonth sx={{ fontSize: { xs: 18, sm: 20 } }} />
          <span>Календарь</span>
        </button>
      </div>
    </div>
  )
}

