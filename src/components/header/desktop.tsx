import React, { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { clsx } from 'clsx'

import type { Nav } from './'
import { Logo } from '../logo'
import { WalletButton } from '../wallet-button'
import { LangSelect } from '../lang-select'
import { RewardButton } from '../reward-button'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { Routes } from '@/routes'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderDesktop = (props: Props) => {
  const { navs, onNavClick } = props
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center gap-3 mr-3 select-none">
        <Logo showMeme className="shrink-0" />
        <nav className="ml-8 flex items-center">
          <ul className="flex items-center gap-2">
            {navs.map((n, i) => {
              if (n.path === Routes.Moonshot || n.path === Routes.ClassicMeme)
                return
              return (
                <li key={i}>
                  <div
                    className={clsx(
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
        <LangSelect className="flex-shrink-0" />
        {/* <Button onClick={() => router.push(Routes.Create)}>
          {t('create.token')}
        </Button> */}
        <WalletButton />
      </div>
    </>
  )
}

export default HeaderDesktop
