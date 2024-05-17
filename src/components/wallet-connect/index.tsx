import React, { type ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { WalletAccount } from './account'
import { WalletConnector } from './connector'

interface Props extends ComponentProps<'div'> {}

export const WalletConnect = (props: Props) => {
  const { isConnected } = useAccount()

  return isConnected ? <WalletAccount /> : <WalletConnector />
}

export default WalletConnect
