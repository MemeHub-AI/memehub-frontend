import React, { ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import type { Nav } from './'

import { Button } from '../ui/button'
import { Logo } from '../logo'
import { WalletConnect } from '../wallet-connect'
import { LangSelect } from '../lang-select'
import { Input } from '@/components/ui/input'
import { SocialLinks } from '../social-links'
import { TradeLogs } from '../trade-logs'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderDesktop = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()

  const [value, setValue] = useState('')
  const onSearch = () => {
    console.log('searching...')
  }

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
        <Input
          value={value}
          placeholder={t('search.placeholder')}
          startIcon={
            <MagnifyingGlassIcon
              width={18}
              height={18}
              className="cursor-pointer ml-2"
              onClick={onSearch}
            />
          }
          onChange={({ target }) => setValue(target.value)}
        />
        <SocialLinks className="ml-3" />
        <LangSelect className="flex-shrink-0 mx-3" />
        {/* <Button
          className="max-sm:mx-1.5"
          onClick={() => router.push(Routes.Create)}
          size="default"
          disabled={router.pathname === Routes.Create}
        >
          {t('token.create')}
        </Button> */}
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderDesktop
