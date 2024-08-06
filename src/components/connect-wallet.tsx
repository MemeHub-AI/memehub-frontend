import React, { type ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { Button } from './ui/button'
import { ChangeChainWallets } from './header/change-chain-wallets'
import { useTonConnectUI } from '@tonconnect/ui-react'

export const ConnectWallet = ({
  children,
  className,
}: ComponentProps<typeof Button>) => {
  const { isConnected } = useAccount()
  const [tonConnectUI, setOptions] = useTonConnectUI()

  return (
    <>
      {isConnected || tonConnectUI.account?.address ? (
        children
      ) : (
        <ChangeChainWallets className={className} />
      )}
    </>
  )
}

export default ConnectWallet

/**
  <Button
    className={className}
    size={isMobile ? 'sm' : 'default'}
    disabled={isConnecting}
    onClick={() => openConnectModal?.()}
    type="button"
  >
    {isConnecting ? t('wallet.connecting') : t('wallet.connect')}
  </Button>
 */
