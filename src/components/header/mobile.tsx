import { type ComponentProps, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import type { Nav } from '.'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { ConnectWallet } from '../connect-wallet'
import { Routes } from '@/routes'
import { AccountDropdown } from '../account-dropdown'
import { useUserStore } from '@/stores/use-user-store'
import { Avatar } from '../ui/avatar'
import HeaderMobileSheet from './mobile-sheet'
import HowToWorkDialog from '../how-to-work-dialog'
import Logo from '../logo'

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
  const [sheetOpen, setSheetOpen] = useState(false)

  // console.log('userinfo:', userInfo)

  return (
    <>
      <Sheet
        open={sheetOpen}
        onOpenChange={(status) => {
          if (!userInfo) return
          setSheetOpen(status)
        }}
      >
        <SheetTrigger asChild ref={closeRef}>
          <div className="flex justify-start items-center space-x-2 max-sm:space-x-0">
            <div className="flex text-xl mt-1">
              <Avatar
                className="w-10 h-10 rounded-full"
                src={userInfo?.logo}
                alt="avatar"
              />
            </div>
            <Logo
              src="/images/logo.png"
              alt="logo"
              showLogo={false}
              className="mt-1 w-10 max-sm:hidden absolute"
            />
          </div>
        </SheetTrigger>

        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          showClose={false}
          side="left"
          className="pt-4 px-3"
        >
          <HeaderMobileSheet userInfo={userInfo} setSheetOpen={setSheetOpen} />
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
