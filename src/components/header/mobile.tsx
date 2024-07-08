import React, { ComponentProps, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

import type { Nav } from '.'

import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Logo } from '../logo'
import { LangSelect } from '../lang-select'
import { WalletConnect } from '../wallet-connect'
import { WalletDisconnector } from '../wallet-connect/components/disconnector'
import { SearchInput } from '../search-input'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import RewardButton from '../reward-button'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderMobile = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()
  const router = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Sheet>
        <SheetTrigger asChild ref={closeRef}>
          <div className="flex justify-start items-center gap-2">
            <Logo src="/images/logo.png" alt="logo" className="mt-1 w-10" />
            <Button size="icon-sm">
              <HamburgerMenuIcon />
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          showClose={false}
          side="bottom"
          className="pt-4 px-3 rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            {/* <Logo showMeme />
            <LangSelect className="ml-3 h-7" /> */}
          </div>
          <ul className="flex flex-col gap-3 mt-3 mb-1">
            {navs.map((n, i) => (
              <li key={i}>
                <div
                  className="w-full justify-start"
                  onClick={() => {
                    onNavClick?.(n)
                    closeRef.current?.click()
                  }}
                >
                  {n.title}
                </div>
              </li>
            ))}
          </ul>
          <LangSelect className="h-7 mb-9 size-fit w-full justify-start" />
          <WalletDisconnector
            size="sm"
            variant="destructive"
            className="absolute bottom-4 left-3 right-3 inline-flex items-center gap-2"
            onConfirm={() => closeRef.current?.click()}
          >
            <span>{t('disconnect')}</span>
          </WalletDisconnector>
        </SheetContent>
      </Sheet>

      {/* <SearchInput /> */}
      <div className="flex justify-between items-center gap-2 ml-1">
        <Button
          className="bg-lime-green"
          size={'sm'}
          onClick={() => router.push(Routes.Airdrop)}
        >
          <img src="/images/gift.png" className="w-5" />
        </Button>
        <RewardButton className="max-sm:px-2" showReferral={false} />
        <Button
          variant="outline"
          className="mx-3 max-sm:mx-0"
          size={'sm'}
          onClick={() => router.push(Routes.Create)}
        >
          {t('create.token')}
        </Button>
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderMobile
