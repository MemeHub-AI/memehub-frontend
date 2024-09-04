import { type ComponentProps, useRef } from 'react'
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
import { ConnectWallet } from '../connect-wallet'
import { Routes } from '@/routes'
import { RewardButton } from '../reward-button'
import { cn } from '@/lib/utils'
import { memehubLinks } from '@/config/link'
import { AccountDropdown } from '../account-dropdown'
import { SocialLinks } from '../social-links'
import HowToWorkDialog from '../how-to-work-dialog'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderMobile = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()
  const { pathname, ...router } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { isConnected } = useAccount()

  return (
    <>
      <Sheet>
        <SheetTrigger asChild ref={closeRef}>
          <div className="flex justify-start items-center space-x-2 max-sm:space-x-0">
            <div className="flex text-xl mt-1">
              <SlMenu />
              <MdArrowDropDown />
            </div>
            <Logo
              src="/images/logo.png"
              alt="logo"
              className="mt-1 w-10 max-sm:hidden absolute"
            />
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
              <li
                key={i}
                className={cn(
                  'w-full justify-start text-lg',
                  pathname === n.path && 'text-blue-600'
                )}
                onClick={() => {
                  onNavClick?.(n)
                  closeRef.current?.click()
                }}
              >
                {n.title}
              </li>
            ))}
          </ul>
          <LangSelect className="size-fit w-full justify-start text-lg" />
          <HowToWorkDialog className="my-3" />
          <SocialLinks
            x={memehubLinks.x}
            tg={memehubLinks.tg}
            whitepaper={memehubLinks.whitepaper}
            className="justify-start"
            size={28}
          />
        </SheetContent>
      </Sheet>

      <div className="flex justify-between items-center space-x-2 ml-1">
        <Button
          className="bg-lime-green w-8 p-0"
          size="sm"
          onClick={() => router.push(Routes.Airdrop)}
        >
          <img src="/images/gift.png" className="w-5" />
        </Button>
        {isConnected && (
          <RewardButton className="max-sm:px-2" showReferral={false} />
        )}
        <Button
          variant="outline"
          className="mx-3 max-sm:mx-0"
          size="sm"
          onClick={() => router.push(Routes.MemexCreate)}
        >
          {t('header.post.idea')}
        </Button>
        <ConnectWallet>
          <AccountDropdown />
        </ConnectWallet>
      </div>
    </>
  )
}

export default HeaderMobile
