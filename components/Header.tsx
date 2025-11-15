'use client'

import { IconButton } from '@mui/material'
import { Menu, Settings, Mic } from '@mui/icons-material'
import WLogo from './WLogo'

interface HeaderProps {
  onMenuClick?: () => void
  onSettingsClick?: () => void
}

export default function Header({ onMenuClick, onSettingsClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-gray-200">
      <IconButton 
        onClick={onMenuClick}
        sx={{ color: '#1f2937', padding: { xs: '6px', sm: '8px' } }}
      >
        <Menu sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </IconButton>

      <div className="flex items-center justify-center ml-3">
        <div className="relative">
          <WLogo size={40} />
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        <IconButton 
          onClick={onSettingsClick}
          sx={{ color: '#1f2937', padding: { xs: '6px', sm: '8px' } }}
        >
          <Settings sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
        <IconButton sx={{ color: '#1f2937', padding: { xs: '6px', sm: '8px' } }}>
          <Mic sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </div>
    </div>
  )
}

