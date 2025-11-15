'use client'

import Image from 'next/image'

interface WLogoProps {
  size?: number
  className?: string
}

export default function WLogo({ size = 64, className = '' }: WLogoProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/photo_2025-11-15_14-56-18.jpg"
        alt="Martin AI"
        width={size}
        height={size}
        className="object-cover rounded-full"
        priority
      />
    </div>
  )
}
