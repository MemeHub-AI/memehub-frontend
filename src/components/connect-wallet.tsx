import React, { type ComponentProps } from 'react'

import { Button } from './ui/button'
import { useConnectWallet } from '@/hooks/use-connect-wallet'
import { useAccount } from 'wagmi'
import ChangeChainWallets from './header/wallets-connect/change-chain-wallets'

export const ConnectWallet = ({
  children,
  className,
}: ComponentProps<typeof Button>) => {
  // const { walletIsConnected } = useConnectWallet()
  const { isConnected } = useAccount()

  return (
    <>{isConnected ? children : <ChangeChainWallets className={className} />}</>
  )
}

export default ConnectWallet
