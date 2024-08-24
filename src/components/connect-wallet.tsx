import React, { useState, type ComponentProps } from 'react'

import { Button } from './ui/button'
import { ChangeChainWallets } from './header/change-chain-wallets'
import { useConnectWallet } from '@/hooks/use-connect-wallet'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useResponsive } from '@/hooks/use-responsive'
import { useStorage } from '@/hooks/use-storage'

export const ConnectWallet = ({
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  // const { walletIsConnected } = useConnectWallet()
  const { t } = useTranslation()
  const { isConnected, isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isMobile } = useResponsive()
  const [isOpening, setIsOpening] = useState(false)
  const { setMainChain } = useStorage()

  return isConnected ? (
    children
  ) : (
    <Button
      size={isMobile ? 'sm' : 'default'}
      disabled={isConnecting}
      type="button"
      onClick={() => openConnectModal?.()}
      {...props}
    >
      {isConnecting ? t('wallet.connecting') : t('wallet.connect')}
    </Button>
  )
}

export default ConnectWallet
