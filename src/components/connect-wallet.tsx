import React, { type ComponentProps } from 'react'

import { Button } from './ui/button'
import { ChangeChainWallets } from './header/change-chain-wallets'
import { useConnectWallet } from '@/hooks/use-connect-wallet'

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
