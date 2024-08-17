import React, { type ComponentProps } from 'react'

import { Button } from './ui/button'
import { useConnectWallet } from '@/hooks/use-connect-wallet'
import ChangeChainWallets from './header/wallets-connect/change-chain-wallets'

export const ConnectWallet = ({
  children,
  className,
}: ComponentProps<typeof Button>) => {
  // const { getMainChain } = useStorage()
  const { walletIsConnected } = useConnectWallet()

  return (
    <>
      {walletIsConnected() ? (
        children
      ) : (
        <ChangeChainWallets className={className} />
      )}
    </>
  )
}

export default ConnectWallet
