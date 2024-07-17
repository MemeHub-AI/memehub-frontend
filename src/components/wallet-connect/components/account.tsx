import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ChevronDown, User } from 'lucide-react'

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
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'

export const WalletAccount = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { isMobile } = useResponsive()
  const [open, setOpen] = useState(false)

  const getUsername = () => {
    const username = userInfo?.name
    if (username) {
      if (username.length > 4) {
        return userInfo?.name.substring(0, 4) + '...'
      } else {
        return username
      }
    } else {
      return t('login')
    }
  }

  const getComp = () => {
    if (isMobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-wrap h-8 w-12 p-2 text-xs">
              {getUsername()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="pb-0">
              <Button
                className="w-full space-x-2 justify-start px-0"
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
                <span>{t('view.profile')}</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-0">
              <SocialLinks className="flex-col !px-0 w-full" size="default" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-1"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <WalletDisconnector/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    } else {
      return (
        <HoverCard openDelay={100} onOpenChange={setOpen}>
          <HoverCardTrigger asChild>
            <Button className="flex items-center px-1 gap-1">
              <Avatar
                src={userInfo?.logo || ''}
                fallback={userInfo?.wallet_address.slice(-2)}
                size={28}
                className="border-2 border-black"
              />
              <p>
                {fmt.addr(userInfo?.wallet_address, { preLen: 2, sufLen: 4 })}
              </p>
              <ChevronDown
                size={18}
                className={cn('duration-300', open && ' rotate-180')}
              />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col p-1 w-32">
            <Button
              className="w-full gap-2 justify-start px-2"
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
