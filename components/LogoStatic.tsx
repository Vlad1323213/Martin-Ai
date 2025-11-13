'use client'

interface LogoStaticProps {
  size?: number
  className?: string
}

export default function LogoStatic({ size = 40, className = '' }: LogoStaticProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Черный фон */}
        <rect width="100" height="100" rx="20" fill="#000000"/>
        
        {/* Жирный белый шестиугольник */}
        <path
          d="M 50 18 L 75 33 L 75 67 L 50 82 L 25 67 L 25 33 Z"
          stroke="#FFFFFF"
          strokeWidth="9"
          fill="#000000"
          strokeLinejoin="miter"
        />
      </svg>
    </div>
  )
}
