import React, { useEffect, useRef, type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import type { Nav } from './'

import { Button } from '../ui/button'
import { Logo } from '../logo'
import { WalletConnect } from '../wallet-connect'
import { LangSelect } from '../lang-select'
import { SocialLinks } from '../social-links'
import { Routes } from '@/routes'
import { SearchInput } from '../search-input'
import { RewardButton } from '../reward-button'
import { useHeaderStore } from '@/stores/use-header-store'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderDesktop = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { setRewardButtonEl } = useHeaderStore()

  useEffect(() => {
    if (!buttonRef.current) return
    setRewardButtonEl(buttonRef.current)
  }, [buttonRef.current])

  return (
    <>
      <div className="flex items-center gap-4">
        <Logo showMeme />
        <nav className="ml-[30px] flex items-center gap-3">
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
      </div>
      <div className="flex items-center gap-3">
        <SearchInput />
        {/* {router.pathname !== Routes.Create ? (
          <Button
            className="max-sm:mx-1.5"
            onClick={() => router.push(Routes.Create)}
          >
            {t('token.create')}
          </Button>
        ) : null} */}
        <RewardButton ref={buttonRef} />
        <LangSelect className="flex-shrink-0" />
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderDesktop
