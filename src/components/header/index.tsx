import React from 'react'

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

<<<<<<< Updated upstream
  const navs: Nav[] = []
=======
  const navs: Nav[] = [
    { title: t('home'), path: Routes.Main },
    { title: t('next.moonshot'), path: Routes.Moonshot },
    { title: t('classic.meme'), path: Routes.ClassicMeme },
    // { title: t('create'), path: Routes.Create },
    { title: t('airdrop'), path: Routes.Airdrop },
    { title: t('alliance'), path: Routes.Alliance },
    { title: t('posts'), path: Routes.Posts },
    // { title: t('KOL'), path: Routes.KOL },
    // { title: t('community'), path: Routes.Community },
  ]
>>>>>>> Stashed changes

  const onNavClick = () => {}

  return (
    <header
      className={cn(
        'min-h-header flex justify-between items-center px-6 relative',
        'sticky top-0 bg-background z-50 transition-all duration-300 max-sm:px-3',
        'border-b-2 border-black'
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
