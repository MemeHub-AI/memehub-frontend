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
import { useIsMemex } from '@/hooks/use-is-memex'
import MemexHeaderMiddle from './memex/header-middle'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderDesktop = ({ navs, onNavClick }: Props) => {
  const { pathname, ...router } = useRouter()
  const { t } = useTranslation()
  const { isMemex } = useIsMemex()

  if (isMemex) {
    return (
      <>
        <div
          className={cn(
            'flex items-center gap-3 mr-3 select-none w-60 ml-2',
            'xl:relative xl:after:absolute xl:after:-top-4 xl:after:-bottom-4 xl:after:right-2 xl:after:w-px xl:after:bg-zinc-200',
            'max-xl:max-w-52'
          )}
        >
          <Logo showMeme className="shrink-0 xl:max-w-32" />
        </div>

        <MemexHeaderMiddle />

        <div className="flex items-center justify-center gap-3">
          <RewardButton />
          <ConnectWallet>
            <AccountDropdown />
          </ConnectWallet>
        </div>
      </>
    )
  }

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
                      (pathname === n.path ||
                        (pathname.includes(Routes.Memex) &&
                          n.path.includes(Routes.Memex))) &&
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
