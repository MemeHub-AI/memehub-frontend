import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import type { Nav } from './'

import { Button } from '../ui/button'
import { Logo } from '../logo'
import { WalletConnect } from '../wallet-connect'
import { Routes } from '@/routes'
import { LangSelect } from '../lang-select'

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
      <Logo showMeme />
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
        <LangSelect className="ml-3" />
        <Button
          className="mx-3 max-sm:mx-1.5"
          onClick={() => router.push(Routes.Create)}
          size="default"
        >
          {t('token.create')}
        </Button>
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderDesktop
