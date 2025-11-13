'use client'

import LogoStatic from './LogoStatic'

export default function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 animate-slide-up">
      <div className="flex-shrink-0 mt-0.5">
        <LogoStatic size={36} />
      </div>

      <div className="px-4 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
        <div className="flex gap-1">
          <div className="chatgpt-dot" style={{ animationDelay: '0ms' }} />
          <div className="chatgpt-dot" style={{ animationDelay: '200ms' }} />
          <div className="chatgpt-dot" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  )
}

