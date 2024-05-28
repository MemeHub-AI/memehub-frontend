import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useResponsive } from '@/hooks/use-responsive'
import { WalletDisconnector } from './disconnector'
import { Avatar } from '../ui/avatar'
import { Routes } from '@/routes'
import { useUserStore } from '@/stores/use-user-store'

export const WalletAccount = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { isMobile } = useResponsive()

  return (
    <div className="flex items-center gap-3 max-sm:gap-1">
      <Avatar
        src={userInfo?.logo || ''}
        fallback={userInfo?.wallet_address.slice(-4)}
        size={isMobile ? 32 : 36}
        className="rounded-lg cursor-pointer"
        fallbackClass="rounded-lg text-xs"
        shadow="default"
        onClick={() => {
          if (!userInfo) {
            return toast.error(t('user.not-found'))
          }
          router.push(`${Routes.Account}/${userInfo?.wallet_address}`)
        }}
      />
      {!isMobile && <WalletDisconnector />}
    </div>
  )
}

export default WalletAccount
