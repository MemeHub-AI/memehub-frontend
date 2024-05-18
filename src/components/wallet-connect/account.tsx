import React from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { useResponsive } from '@/hooks/use-responsive'
import { WalletDisconnector } from './disconnector'
import { Avatar } from '../ui/avatar'
import { Routes } from '@/routes'

export const WalletAccount = () => {
  const router = useRouter()
  const { address } = useAccount()
  const { isMobile } = useResponsive()

  return (
    <div className="flex items-center gap-3 max-sm:gap-1">
      <Avatar
        src=""
        fallback={address?.slice(-4)}
        size={isMobile ? 32 : 36}
        className="rounded-lg cursor-pointer"
        fallbackClass="rounded-lg text-xs"
        onClick={() => router.push(`${Routes.Account}/${address}`)}
      />
      {!isMobile && <WalletDisconnector />}
    </div>
  )
}

export default WalletAccount
