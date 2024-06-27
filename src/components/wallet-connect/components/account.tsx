import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { User } from 'lucide-react'

import { useResponsive } from '@/hooks/use-responsive'
import { WalletDisconnector } from './disconnector'
import { Avatar } from '../../ui/avatar'
import { Routes } from '@/routes'
import { useUserStore } from '@/stores/use-user-store'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../ui/hover-card'
import { SocialLinks } from '../../social-links'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const WalletAccount = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { isMobile } = useResponsive()
  const [open, setOpen] = useState(false)

  const getComp = () => {
    if (isMobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              src={userInfo?.logo || ''}
              fallback={userInfo?.wallet_address.slice(-4)}
              size={isMobile ? 32 : 36}
              className="rounded-lg cursor-pointer select-none"
              fallbackClass="rounded-lg text-xs"
              shadow="default"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="pb-0">
              <Button
                className="w-full gap-2 justify-start px-0"
                variant="ghost"
                shadow="none"
                onClick={() => {
                  if (!userInfo) {
                    return toast.error(t('user.not-found'))
                  }
                  router.push(`${Routes.Account}/${userInfo?.wallet_address}`)
                }}
              >
                <User size={20} className="shrink-0" />
                {t('view.profile')}
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-0">
              <SocialLinks className="flex-col !px-0" size="default" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-1"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <WalletDisconnector />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    } else {
      return (
        <HoverCard openDelay={100}>
          <HoverCardTrigger>
            <Avatar
              src={userInfo?.logo || ''}
              fallback={userInfo?.wallet_address.slice(-4)}
              size={isMobile ? 32 : 36}
              className="rounded-lg cursor-pointer select-none"
              fallbackClass="rounded-lg text-xs"
              shadow="default"
            />
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col mr-5 p-1 w-40">
            <Button
              className="w-full gap-2 justify-start"
              variant="ghost"
              shadow="none"
              onClick={() => {
                if (!userInfo) {
                  return toast.error(t('user.not-found'))
                }
                router.push(`${Routes.Account}/${userInfo?.wallet_address}`)
              }}
            >
              <User size={20} className="shrink-0" />
              {t('view.profile')}
            </Button>
            <SocialLinks className="flex-col" size="default" />
            <WalletDisconnector />
          </HoverCardContent>
        </HoverCard>
      )
    }
  }

  return <div className="flex items-center gap-3 max-sm:gap-1">{getComp()}</div>
}

export default WalletAccount
