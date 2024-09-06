import React from 'react'
import { IoIosMore } from 'react-icons/io'
import { MdLogout } from 'react-icons/md'

import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Avatar } from '../../ui/avatar'
import { fmt } from '@/utils/fmt'
import { useDisconnect } from 'wagmi'
import { useSignLogin } from '@/hooks/use-sign-login'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import { UserInfoRes } from '@/api/user/types'
import { Routes } from '@/routes'
import ConnectWallet from '@/components/connect-wallet'

export const NavAccountPopover = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { t } = useTranslation()
  const { disconnect } = useDisconnect()
  const { logout } = useSignLogin()

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        className="border border-zinc-200 rounded-sm flex space-x-2 items-center hover:bg-slate-100 cursor-pointer p-2 w-40"
        side="top"
        align="end"
        alignOffset={-2}
        onClick={() => {
          logout()
          disconnect()
        }}
      >
        <MdLogout />
        <p>{t('disconnect')}</p>
      </PopoverContent>
    </Popover>
  )
}

export const NavAccount = ({
  userInfo,
  isCollapsed,
}: {
  userInfo: UserInfoRes | null
  isCollapsed: boolean
}) => {
  const { pathname, ...router } = useRouter()
  const { t } = useTranslation()

  const userInfoIsCollapsed = () => {
    if (userInfo) {
      if (isCollapsed) {
        return (
          <NavAccountPopover>
            <Avatar src={userInfo?.logo} className="rounded-full w-10 h-10" />
          </NavAccountPopover>
        )
      }

      return (
        <div className="flex items-center">
          <div
            className="flex items-end cursor-pointer"
            onClick={() =>
              router.push(`${Routes.Account}/${userInfo?.wallet_address}`)
            }
          >
            <Avatar src={userInfo?.logo} className="rounded-full w-12 h-12" />
            <div className="flex flex-col space-y-1">
              <span className="text-sm ml-2 font-semibold">
                {userInfo?.name}
              </span>
              <span className="text-xs ml-2 text-gray-500">
                {fmt.addr(userInfo?.wallet_address)}
              </span>
            </div>
          </div>

          <NavAccountPopover>
            <IoIosMore className="ml-24 cursor-pointer" />
          </NavAccountPopover>
        </div>
      )
    }
  }

  return (
    <ConnectWallet
      shadow={'none'}
      className={cn(
        !isCollapsed && 'w-52',
        isCollapsed && 'absolute -left-4 bottom-4 p-1 ml-px'
      )}
      text={isCollapsed ? t('connect') : undefined}
    >
      {userInfoIsCollapsed()}
    </ConnectWallet>
  )
}

export default NavAccount
