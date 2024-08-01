import React, { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import type { Nav } from './'
import { Logo } from '../logo'
import { ConnectWallet } from '../connect-wallet'
import { LangSelect } from '../lang-select'
import { RewardButton } from '../reward-button'
import { cn } from '@/lib/utils'
import { AccountDropdown } from '../account-dropdown'
import { Button } from '../ui/button'
import { Routes } from '@/routes'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderDesktop = ({ navs, onNavClick }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center gap-3 mr-3 select-none">
        <Logo showMeme className="shrink-0" />
        <nav className="ml-8 flex items-center">
          <ul className="flex items-center gap-2">
            {navs.map((n, i) => {
              if (n.mobileOnly) return
              return (
                <li key={i}>
                  <div
                    className={cn(
                      'px-2 py-1.5 rounded-lg cursor-pointer !border-2 border-transparent',
                      'hover:border-black text-nowrap font-bold xl:px-4',
                      router.pathname === n.path &&
                        'bg-black text-white border-black'
                    )}
                    onClick={() => onNavClick?.(n)}
                  >
                    {n.title}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {/* <SearchInput /> */}
        <RewardButton />
        <LangSelect />
        <Button onClick={() => router.push(Routes.Create)}>
          {t('create.token')}
        </Button>
        <ConnectWallet>
          <AccountDropdown />
        </ConnectWallet>
      </div>
    </>
  )
}

export default HeaderDesktop
