import React from 'react'
import { useWindowScroll } from 'react-use'

import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/use-responsive'
import { HeaderMobile } from './mobile'
import { HeaderDesktop } from './desktop'

export interface Nav {
  id: string
  title: string
}

export const Header = () => {
  const { isMobile } = useResponsive()
  const { y } = useWindowScroll()

  const navs: Nav[] = []

  const onNavClick = () => {}

  return (
    <header
      className={cn(
        'min-h-header flex justify-between items-center px-6 relative',
        'sticky top-0 bg-background z-50 transition-all duration-300 max-sm:px-3',
        'border-b border-zinc-200',
        y !== 0 && 'shadow-lg'
      )}
    >
      {isMobile ? (
        <HeaderMobile navs={navs} onNavClick={onNavClick} />
      ) : (
        <HeaderDesktop navs={navs} onNavClick={onNavClick} />
      )}
    </header>
  )
}

export default Header
