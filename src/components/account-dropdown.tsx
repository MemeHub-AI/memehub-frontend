import React, { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { LuTwitter, LuUser } from 'react-icons/lu'
import { useAccount } from 'wagmi'
import { useDisconnect } from 'wagmi'
import { MdLogout } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { LiaTelegramPlane } from 'react-icons/lia'

import { reportException } from '@/errors'
import { useResponsive } from '@/hooks/use-responsive'
import { Avatar } from './ui/avatar'
import { Routes } from '@/routes'
import { useUserStore } from '@/stores/use-user-store'
import { Button } from './ui/button'
import { fmt } from '@/utils/fmt'
import { AlertDialog } from './ui/alert-dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from './ui/dropdown-menu'
import { socialLink } from '@/config/link'

export const AccountDropdown = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const { userInfo } = useUserStore()
  const { isMobile } = useResponsive()
  const { address } = useAccount()

  const { disconnect } = useDisconnect({
    mutation: {
      onError: ({ message }) => reportException(message),
    },
  })

  return (
    <Container
      triggerClass="group"
      trigger={
        <Button
          className="flex items-center px-1 gap-1"
          size={isMobile ? 'sm' : 'default'}
        >
          {!isMobile && (
            <Avatar
              src={userInfo?.logo || ''}
              fallback={userInfo?.name.slice(-2)}
              size={26}
              className="border-2 border-black"
            />
          )}
          <span>
            {userInfo?.name
              ? userInfo?.name.slice(0, 4)
              : fmt.addr(userInfo?.name || address, {
                  preLen: 2,
                  sufLen: 4,
                })}
          </span>
          {!isMobile && (
            <ChevronDownIcon className="w-4 h-4 duration-150 group-data-[state=open]:rotate-180" />
          )}
        </Button>
      }
    >
      <Button
        className="w-full px-2 grid grid-cols-[1.5rem_1fr] text-start"
        variant="ghost"
        shadow="none"
        onClick={() =>
          router.push(`${Routes.Account}/${userInfo?.wallet_address}`)
        }
      >
        <LuUser size={20} />
        <span>{t('view.profile')}</span>
      </Button>

      <Button
        variant="ghost"
        shadow="none"
        className="w-full px-2 grid grid-cols-[1.5rem_1fr] text-start"
        onClick={() => window.open(socialLink.x)}
      >
        <LuTwitter size={18} />
        <span>{t('twitter-x')}</span>
      </Button>

      <Button
        variant="ghost"
        shadow="none"
        className="w-full px-2 grid grid-cols-[1.5rem_1fr] text-start"
        onClick={() => window.open(socialLink.x)}
      >
        <LiaTelegramPlane size={20} />
        <span>{t('telegram')}</span>
      </Button>

      <Button
        variant="ghost"
        shadow="none"
        size={isMobile ? 'icon-sm' : 'default'}
        onClick={() => setDisconnectOpen(true)}
        className="w-full px-2 grid grid-cols-[1.5rem_1fr] text-start"
      >
        <MdLogout size={18} />
        <span>{t('disconnect')}</span>
      </Button>
      <AlertDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title={t('wallet.disconnect')}
        description={t('wallet.disconnect.confirm')}
        onConfirm={() => disconnect()}
      />
    </Container>
  )
}

const Container = ({
  trigger,
  children,
  triggerClass,
}: {
  trigger: ReactNode
  children: ReactNode
  triggerClass?: string
}) => {
  const { isMobile } = useResponsive()

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={triggerClass}>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-w-min -mr-1"
          align={isMobile ? 'end' : 'center'}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild className={triggerClass}>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent
        className="max-w-min p-1"
        align={isMobile ? 'end' : 'center'}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default AccountDropdown