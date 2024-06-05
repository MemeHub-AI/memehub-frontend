import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { first } from 'lodash'

import { useLogin } from '@/hooks/use-login'

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

  const connectWallet = async (connector: (typeof connectors)[number]) => {
    try {
      const { accounts, chainId } = await connectAsync({ connector })
      const curAddress = first(accounts)
      if (!curAddress?.trim()) throw 'No address'
      signLogin(curAddress, chainId)
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
