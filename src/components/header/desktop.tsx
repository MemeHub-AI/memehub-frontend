import React, { useEffect, useRef, type ComponentProps } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { setRewardButtonEl } = useHeaderStore()

  useEffect(() => {
    if (!buttonRef.current) return
    setRewardButtonEl(buttonRef.current)
  }, [buttonRef.current])

  return (
    <>
      <div className="flex items-center gap-3 mr-3 select-none">
        <Logo showMeme className="shrink-0" />
        <nav className="ml-8 flex items-center">
          <ul className="flex items-center gap-2">
            {navs.map((n, i) => (
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
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <SearchInput />
        <RewardButton ref={buttonRef} />
        <LangSelect className="flex-shrink-0" />
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderDesktop
