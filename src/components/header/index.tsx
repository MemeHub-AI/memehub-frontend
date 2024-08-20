import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/use-responsive'
import { HeaderMobile } from './mobile'
import { HeaderDesktop } from './desktop'
import { Routes } from '@/routes'
import { useIsMemex } from '@/hooks/use-is-memex'

export interface Nav {
  title: string
  path: string
  // only show on mobile
  mobileOnly?: boolean
  // only show on memex
  memexOnly?: boolean
}

export const Header = () => {
  const { isPad } = useResponsive()
  const { t } = useTranslation()
  const { push } = useRouter()

  const navs: Nav[] = [
    { title: t('home'), path: Routes.Main },
    { title: t('next.moonshot'), path: Routes.Moonshot, mobileOnly: true },
    { title: t('classic.meme'), path: Routes.ClassicMeme, mobileOnly: true },
    // { title: t('create'), path: Routes.Create },
    { title: t('airdrop'), path: Routes.Airdrop },
    { title: t('alliance'), path: Routes.Alliance },
    { title: 'Memex', path: Routes.Memex },

    // { title: t('KOL'), path: Routes.KOL },
    // { title: t('community'), path: Routes.Community },
  ]

  const onNavClick = (n: Nav) => {
    push({ pathname: n.path })
  }

  return (
    <header
      className={cn(
        'min-h-header flex justify-between items-center px-6 relative',
        'sticky top-0 bg-background z-50 transition-all duration-300 max-sm:px-3',
        'border-b-2 border-black',
        'xl:justify-center'
      )}
    >
      {isPad ? (
        <HeaderMobile navs={navs} onNavClick={onNavClick} />
      ) : (
        <div className="flex justify-between items-center w-full max-w-[1470px]">
          <HeaderDesktop navs={navs} onNavClick={onNavClick} />
        </div>
      )}
    </header>
  )
}

export default Header
