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
  // only show on mobile
  mobileOnly?: boolean
}

export const Header = () => {
  const { isPad, isMobile } = useResponsive()
  const { t } = useTranslation()
  const { push } = useRouter()

  const withMobileIcon = (icon: string, text: string) =>
    isMobile ? `${icon} ${text}` : text

  const navs: Nav[] = [
    { title: withMobileIcon('🏠', t('home')), path: Routes.Main },
    { title: t('next.moonshot'), path: Routes.Moonshot, mobileOnly: true },
    { title: t('classic.meme'), path: Routes.ClassicMeme, mobileOnly: true },
    // { title: t('create'), path: Routes.Create },
    { title: t('airdrop'), path: Routes.Airdrop },
    { title: withMobileIcon('🤝', t('alliance')), path: Routes.Alliance },
    { title: withMobileIcon('🌟', t('header.idea')), path: Routes.Memex },

    // { title: t('KOL'), path: Routes.KOL },
    // { title: t('community'), path: Routes.Community },
  ]

  const mobileNav: Nav[] = [
    { title: withMobileIcon('🌟', t('header.idea')), path: Routes.Memex },
    { title: withMobileIcon('🏠', t('header.coin')), path: Routes.Main },
    { title: t('next.moonshot'), path: Routes.Moonshot },
    { title: t('classic.meme'), path: Routes.ClassicMeme },
    { title: t('airdrop'), path: Routes.Airdrop },
    { title: withMobileIcon('🤝', t('alliance')), path: Routes.Alliance },
  ]

  const onNavClick = (n: Nav) => {
    push({ pathname: n.path })
  }

  return (
    <header
      className={cn(
        'min-h-header flex justify-between items-center px-6 relative border-b-2',
        'sticky top-0 bg-background z-50 transition-all duration-300 max-sm:px-3'
      )}
    >
      {isPad ? (
        <HeaderMobile navs={mobileNav} onNavClick={onNavClick} />
      ) : (
        <HeaderDesktop navs={navs} onNavClick={onNavClick} />
      )}
    </header>
  )
}

export default Header
