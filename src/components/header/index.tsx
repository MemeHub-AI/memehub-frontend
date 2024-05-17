import React from 'react'

import { cn } from '@/lib/utils'
import { Logo } from '../logo'

export const Header = () => {
  return (
    <header
      className={cn(
        'min-h-header flex justify-between items-center px-6 relative',
        'sticky top-0 bg-background z-50 transition-all duration-300 max-sm:px-3',
        'border-b border-zinc-200'
      )}
    >
      <Logo showMeme />
    </header>
  )
}

export default Header
