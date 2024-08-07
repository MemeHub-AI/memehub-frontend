import React, { ComponentProps, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SlMenu } from 'react-icons/sl'
import { MdArrowDropDown } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import type { Nav } from '.'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Logo } from '../logo'
import { LangSelect } from '../lang-select'
import { WalletConnect } from '../wallet-connect'
import { WalletDisconnector } from '../wallet-connect/components/disconnector'
import { Routes } from '@/routes'
import RewardButton from '../reward-button'
import { cn } from '@/lib/utils'
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import { socialLink } from '@/config/link'

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

  const links = [
    {
      name: t('telegram'),
      icon: <FaTelegramPlane />,
      link: socialLink.tg,
    },
    {
      name: t('twitter-x'),
      icon: <FaTwitter />,
      link: socialLink.x,
    },
  ]

  return (
    <>
      <Sheet>
        <SheetTrigger asChild ref={closeRef}>
          <div className="flex justify-start items-center space-x-2">
            <Logo
              src="/images/logo.png"
              alt="logo"
              className="mt-1 w-10 max-[375px]:hidden"
            />
            <div className="flex font-extraboldc text-xl mt-1">
              <SlMenu />
              <MdArrowDropDown />
            </div>
          </div>
        </SheetTrigger>

        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          showClose={false}
          side="bottom"
          className="pt-4 px-3 rounded-t-lg font-bold"
        >
          <ul className="flex flex-col space-y-3 mt-3 mb-1">
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
          <LangSelect
            className={cn(
              isConnected && 'mb-9',
              'size-fit w-full justify-start'
            )}
          />
          <div className="flex space-x-6 text-2xl mt-20">
            {links.map((l, i) => (
              <div
                key={i}
                className="gap-2 px-2 justify-start items-start max-sm:!px-0 max-sm:py-2"
                onClick={() => {
                  if (l.link) open(l.link)
                }}
              >
                {l.icon}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* <SearchInput /> */}
      <div className="flex justify-between items-center space-x-2 ml-1">
        <Button
          className="bg-lime-green w-8 p-0"
          size={'sm'}
          onClick={() => router.push(Routes.Airdrop)}
        >
          <img src="/images/gift.png" className="w-5" />
        </Button>
        {isConnected && (
          <RewardButton className="max-sm:px-2" showReferral={false} />
        )}
        {/* <Button
          variant="outline"
          className="mx-3 max-sm:mx-0"
          size={'sm'}
          onClick={() => router.push(Routes.Create)}
        >
          {t('create.token')}
        </Button> */}
        <WalletConnect />
      </div>
    </>
  )
}

export default HeaderMobile
