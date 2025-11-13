export default function GoogleCalendarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#FFFFFF"/>
      <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V9H3V7Z" fill="#EA4335"/>
      <rect x="6" y="11" width="4" height="4" rx="0.5" fill="#1A73E8"/>
      <rect x="14" y="11" width="4" height="4" rx="0.5" fill="#34A853"/>
      <rect x="6" y="16" width="4" height="3" rx="0.5" fill="#FBBC04"/>
      <rect x="14" y="16" width="4" height="3" rx="0.5" fill="#EA4335"/>
      <text x="12" y="14" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#5F6368">15</text>
    </svg>
  )
}
