import React, { type ComponentProps } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { Button } from './ui/button'
import { useResponsive } from '@/hooks/use-responsive'

export const ConnectWallet = ({
  children,
  className,
}: ComponentProps<typeof Button>) => {
  const { t } = useTranslation()
  const { isConnected, isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isMobile } = useResponsive()

  return (
    <>
      {isConnected ? (
        children
      ) : (
        <Button
          className={className}
          size={isMobile ? 'sm' : 'default'}
          disabled={isConnecting}
          onClick={() => openConnectModal?.()}
        >
          {isConnecting ? t('wallet.connecting') : t('wallet.connect')}
        </Button>
      )}
    </>
  )
}

export default ConnectWallet
