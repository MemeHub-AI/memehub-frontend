import React, { ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Nav } from './'

import { Button } from '../ui/button'
import { Logo } from '../logo'
import { WalletConnect } from '../wallet-connect'
import { LangSelect } from '../lang-select'
import { Input } from '../input'
import { SocialLinks } from '../social-links'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

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

  const [value, setValue] = useState('')
  const onSearch = () => {
    console.log('searching...')
  }

  return (
    <>
      <Logo showMeme />
      <div className="flex items-center gap-3">
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
        <LangSelect className="flex-shrink-0" />
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
