'use client'

import WLogo from './WLogo'

export default function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 animate-slide-up">
      <div className="flex-shrink-0 mt-0.5">
        <WLogo size={36} />
      </div>

      <div className="px-4 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-gray-100 border border-gray-200">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

