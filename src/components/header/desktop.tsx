import React, { useEffect, useRef, type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

import type { Nav } from './'

import { Logo } from '../logo'
import { WalletConnect } from '../wallet-connect'
import { LangSelect } from '../lang-select'
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
          <ul className="flex items-center gap-2">
            {navs.map((n, i) => (
              <li key={i}>
                <div
                  className={clsx(
                    'px-4 py-2 rounded-lg cursor-pointer border-2 border-white hover:border-2 hover:border-black text-nowrap font-bold',
                    router.pathname === n.path
                      ? '!border-2 !border-black bg-black text-white'
                      : ''
                  )}
                  onClick={() => onNavClick?.(n)}
                >
                  {n.title}
                </div>
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
