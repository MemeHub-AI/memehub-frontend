import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/use-responsive'
import { HeaderMobile } from './mobile'
import { HeaderDesktop } from './desktop'
import { Routes } from '@/routes'

export interface Nav {
  title: string
  path: string
}

export const Header = () => {
  const { isPad } = useResponsive()
  const { t } = useTranslation()
  const { push } = useRouter()

  const navs: Nav[] = [
    { title: t('home'), path: Routes.Main },
    { title: t('next.moonshot'), path: Routes.Moonshot },
    { title: t('classic.meme'), path: Routes.ClassicMeme },
    // { title: t('create'), path: Routes.Create },
    { title: t('airdrop'), path: Routes.Airdrop },
    { title: t('alliance'), path: Routes.Alliance },
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
        'border-b-2 border-black'
      )}
    >
      {isPad ? (
        <HeaderMobile navs={navs} onNavClick={onNavClick} />
      ) : (
        <HeaderDesktop navs={navs} onNavClick={onNavClick} />
      )}
    </header>
  )
}

export default Header
