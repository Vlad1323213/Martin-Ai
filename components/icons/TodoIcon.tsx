export default function TodoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#FFFFFF"/>
      <rect x="4" y="2" width="16" height="3" fill="#4285F4"/>
      <line x1="7" y1="9" x2="17" y2="9" stroke="#E8EAED" strokeWidth="1"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke="#E8EAED" strokeWidth="1"/>
      <line x1="7" y1="15" x2="17" y2="15" stroke="#E8EAED" strokeWidth="1"/>
      <line x1="7" y1="18" x2="17" y2="18" stroke="#E8EAED" strokeWidth="1"/>
      <circle cx="8" cy="9" r="1.5" fill="#34A853"/>
      <path d="M7.5 9L7.8 9.3L8.5 8.6" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="12" r="1.5" fill="#34A853"/>
      <path d="M7.5 12L7.8 12.3L8.5 11.6" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="15" r="1.5" fill="#DADCE0"/>
      <line x1="10.5" y1="9" x2="16" y2="9" stroke="#5F6368" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="10.5" y1="12" x2="15" y2="12" stroke="#5F6368" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="10.5" y1="15" x2="16.5" y2="15" stroke="#5F6368" strokeWidth="0.8" strokeLinecap="round"/>
      <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="#DADCE0" strokeWidth="0.5"/>
    </svg>
  )
}
