import React, { type ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { WalletAccount } from './components/account'
import { WalletConnector } from './components/connector'
import { useWatchAccount } from './hooks/use-watch-account'

interface Props extends ComponentProps<'div'> {}

export const WalletConnect = (props: Props) => {
  const { isConnected } = useAccount()

  useWatchAccount()

  return isConnected ? <WalletAccount /> : <WalletConnector />
}

export default WalletConnect
