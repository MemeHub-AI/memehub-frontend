import {
  Connector,
  CreateConnectorFn,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import { first } from 'lodash'

import { useLogin } from '@/hooks/use-login'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUserStore } from '@/stores/use-user-store'
import { reportException } from '@/errors'

export const useWallet = () => {
  const {
    address,
    addresses,
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
  } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { signLogin, logout } = useLogin()
  const { setConnectOpen } = useWalletStore()
  const { setUserInfo } = useUserStore()

  const connectWallet = async (connector: CreateConnectorFn | Connector) => {
    try {
      if (isConnected) {
        return await signLogin()
      }
      const { accounts, chainId } = await connectAsync({ connector })
      const curAddress = first(accounts)
      if (!curAddress?.trim()) throw 'No address'
      setConnectOpen(false)
      await signLogin(curAddress, chainId)
    } catch (e) {
      reportException(e)
      disconnectWallet()
    }
  }

  const disconnectWallet = async () => {
    try {
      await disconnectAsync()
      logout()
      setUserInfo(null)
    } catch (e) {
      reportException(e)
    }
  }

  return {
    address,
    addresses,
    connectors,
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
    connectWallet,
    disconnectWallet,
  }
}
