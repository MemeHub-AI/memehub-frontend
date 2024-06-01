import React, { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import type { Nav } from './'

import { Button } from '../ui/button'
import { Logo } from '../logo'
import { WalletConnect } from '../wallet-connect'
import { LangSelect } from '../lang-select'
import { SocialLinks } from '../social-links'
import { TradeLogs } from '../trade-logs'
import { SearchInput } from '../search-input'
import { Routes } from '@/routes'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderDesktop = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <div className="flex items-center gap-4">
        <Logo showMeme />
        <TradeLogs />
      </div>
      <div className="flex items-center">
        <nav className="flex items-center gap-3">
          <ul className="flex items-center gap-3">
            {navs.map((n, i) => (
              <li key={i}>
                <Button variant="ghost" onClick={() => onNavClick?.(n)}>
                  {n.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <SearchInput />
        <SocialLinks className="ml-3" />
        <LangSelect className="flex-shrink-0 mx-3" />
        <Button
          className="max-sm:mx-1.5 mr-3"
          onClick={() => router.push(Routes.Create)}
          disabled={router.pathname === Routes.Create}
        >
          {t('token.create')}
        </Button>
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderDesktop
