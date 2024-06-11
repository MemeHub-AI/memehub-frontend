import React, { ComponentProps, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useAccount } from 'wagmi'

import type { Nav } from '.'

import { Button } from '../ui/button'
import { Routes } from '@/routes'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Logo } from '../logo'
import { LangSelect } from '../lang-select'
import { WalletConnect } from '../wallet-connect'
import { WalletDisconnector } from '../wallet-connect/components/disconnector'
import { SearchInput } from '../search-input'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderMobile = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()
  const router = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { isConnected } = useAccount()

  return (
    <>
      <Sheet>
        <SheetTrigger asChild ref={closeRef}>
          <div className="flex justify-start items-center gap-2">
            <Button size="icon-sm">
              <HamburgerMenuIcon />
            </Button>
            {/* <Logo showMeme /> */}
          </div>
        </SheetTrigger>
        <SearchInput className="h-8 ml-3 mr-1" />
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          showClose={false}
          side="left"
          className="pt-4 px-3"
        >
          <div className="flex items-center gap-2">
            <Logo showMeme />
            <LangSelect className="ml-3 h-7" />
          </div>
          <ul className="flex flex-col gap-3 mt-3">
            {navs.map((n, i) => (
              <li key={i}>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => {
                    onNavClick?.(n)
                    closeRef.current?.click()
                  }}
                >
                  {n.title}
                </Button>
              </li>
            ))}
          </ul>
          <WalletDisconnector
            size="sm"
            variant="destructive"
            className="absolute bottom-4 left-4 right-4 inline-flex items-center gap-2"
            onConfirm={() => closeRef.current?.click()}
          >
            <span>{t('disconnect')}</span>
          </WalletDisconnector>
        </SheetContent>
      </Sheet>

      <div className="flex items-center">
        {/* {isConnected && router.pathname !== Routes.Create && (
          <Button
            className="mx-3 max-sm:mx-1.5"
            onClick={() => router.push(Routes.Create)}
            size="sm"
          >
            {t('token.create')}
          </Button>
        )} */}
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderMobile
