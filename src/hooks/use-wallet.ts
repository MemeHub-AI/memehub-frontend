import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { first } from 'lodash'

import { useSign } from './use-sign'
import { useUser } from './use-user'

export const useWallet = () => {
  const {
    address,
    addresses,
    status,
    chainId,
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
  } = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()
  const { signAsync } = useSign()
  const { login, logout } = useUser()

  const connectWallet = async (connector: (typeof connectors)[number]) => {
    try {
      const { accounts, chainId } = await connectAsync({ connector })
      const address = first(accounts)
      const timestamp = Date.now().toString()
      const message = await signAsync(timestamp)

      if (!address?.trim()) throw 'No address'
      login({
        wallet_address: address,
        chain_id: chainId.toString(),
        sign: message,
        timestamp,
      })
    } catch (e) {
      console.error(`[connectWallet error]: ${e}`)
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

  // Auto switch chain when connected.
  useEffect(() => {
    if (status === 'connected') {
      switchChainAsync({ chainId }).catch((e) =>
        console.log(`Switch chain error: ${e}`)
      )
    }
  }, [status])

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
