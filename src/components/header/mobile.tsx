import { type ComponentProps, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LuUser2 } from 'react-icons/lu'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import type { Nav } from '.'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { LangSelect } from '../lang-select'
import { ConnectWallet } from '../connect-wallet'
import { Routes } from '@/routes'
import { cn } from '@/lib/utils'
import { memehubLinks } from '@/config/link'
import { AccountDropdown } from '../account-dropdown'
import { SocialLinks } from '../social-links'
import { useUserStore } from '@/stores/use-user-store'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import HeaderMobileSheet from './mobile-sheet'

interface Props extends ComponentProps<'div'> {
  navs: Nav[]
  onNavClick?: (nav: Nav) => void
}

export const HeaderMobile = (props: Props) => {
  const { navs, onNavClick } = props
  const { t } = useTranslation()
  const { pathname, ...router } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { userInfo } = useUserStore()

  return (
    <>
      <Sheet>
        <SheetTrigger asChild ref={closeRef}>
          <div className="flex justify-start items-center space-x-2 max-sm:space-x-0">
            <div className="flex text-xl mt-1">
              <Avatar
                className="w-10 h-10 rounded-full"
                src={userInfo?.logo}
                alt="avatar"
              />
            </div>
          </div>
        </SheetTrigger>

        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          showClose={false}
          side="left"
          className="pt-4 px-3"
        >
          <HeaderMobileSheet userInfo={userInfo} />
          {/* <ul className="flex flex-col space-y-3 mt-3 mb-1">
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
          </ul> */}

          {/* <SocialLinks
            x={memehubLinks.x}
            tg={memehubLinks.tg}
            className="justify-start"
            size={28}
          /> */}
        </SheetContent>
      </Sheet>

      <div className="flex justify-between items-center space-x-2 ml-1">
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
