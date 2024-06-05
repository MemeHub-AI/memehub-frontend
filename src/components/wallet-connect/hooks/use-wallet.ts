import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { first } from 'lodash'

import { useLogin } from '@/hooks/use-login'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUserStore } from '@/stores/use-user-store'

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

  const connectWallet = async (connector: (typeof connectors)[number]) => {
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
      console.error('[connectWallet error]:', e)
      disconnectWallet()
    }
  }

  const disconnectWallet = async () => {
    console.log('disconnect')
    try {
      await disconnectAsync()
      logout()
      setUserInfo(null)
    } catch (e) {
      console.error(`[disconnectWallet error] : ${e}`)
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
