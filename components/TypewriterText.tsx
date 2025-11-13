'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function TypewriterText({ text, speed = 25, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return // Не запускаем анимацию до монтирования
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete, mounted])

  // Автоматический скролл за курсором
  useEffect(() => {
    if (cursorRef.current && currentIndex < text.length) {
      cursorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [displayedText, currentIndex, text.length])

  return (
    <span className="inline-block">
      {displayedText}
      {currentIndex < text.length && (
        <span 
          ref={cursorRef}
          className="inline-block w-[2px] h-[1.1em] bg-white/80 animate-blink ml-[2px] -mb-[1px] align-text-bottom" 
        />
      )}
    </span>
  )
}

