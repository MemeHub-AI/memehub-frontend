import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

import { useSign } from './use-sign'

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

  const connectWallet = async (connector: (typeof connectors)[number]) => {
    try {
      await connectAsync({ connector })
      await signAsync()
    } catch (e) {
      console.error(`Connect wallet error: ${e}`)
    }
  }

  const disconnectWallet = async () => {
    try {
      await disconnectAsync()
    } catch (e) {
      console.error(`Disconnect wallet error: ${e}`)
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
