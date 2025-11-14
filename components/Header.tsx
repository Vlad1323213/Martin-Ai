'use client'

import { IconButton } from '@mui/material'
import { Menu, Settings, Mic } from '@mui/icons-material'
import LogoStatic from './LogoStatic'

interface HeaderProps {
  onMenuClick?: () => void
  onSettingsClick?: () => void
}

export default function Header({ onMenuClick, onSettingsClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-telegram-bg">
      <IconButton 
        onClick={onMenuClick}
        sx={{ color: 'white', padding: { xs: '6px', sm: '8px' } }}
      >
        <Menu sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </IconButton>

      <div className="flex items-center justify-center ml-3">
        <div className="relative">
          <LogoStatic size={50} className="drop-shadow-lg" />
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        <IconButton 
          onClick={onSettingsClick}
          sx={{ color: 'white', padding: { xs: '6px', sm: '8px' } }}
        >
          <Settings sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
        <IconButton sx={{ color: 'white', padding: { xs: '6px', sm: '8px' } }}>
          <Mic sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </div>
    </div>
  )
}

