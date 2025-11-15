'use client'

import Image from 'next/image'

interface WLogoProps {
  size?: number
  className?: string
}

export default function WLogo({ size = 64, className = '' }: WLogoProps) {
  return (
    <div
      className={`relative rounded-full ring-2 ring-white/30 p-2 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
        <Image
          src="/photo_2025-11-15_14-56-18.jpg"
          alt="Martin AI"
          width={size - 16}
          height={size - 16}
          className="object-contain rounded-full"
          priority
        />
      </div>
    </div>
  )
}
