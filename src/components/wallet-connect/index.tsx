import React, { type ComponentProps } from 'react'
import { useAccount } from 'wagmi'

import { WalletAccount } from './components/account'
import { WalletConnector } from './components/connector'
import { useWatchAccount } from './hooks/use-watch-account'
import { useUserStore } from '@/stores/use-user-store'
import { useStorage } from '@/hooks/use-storage'

interface Props extends ComponentProps<'div'> {}

export const WalletConnect = (props: Props) => {
  const { isConnected } = useAccount()
  const { userInfo } = useUserStore()
  const { getToken } = useStorage()

  useWatchAccount()

  return isConnected && userInfo && getToken() ? (
    <WalletAccount />
  ) : (
    <WalletConnector />
  )
}

export default WalletConnect
