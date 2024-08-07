import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { useAccount, useDisconnect } from 'wagmi'
import { useStorage } from './use-storage'
import { reportException } from '@/errors'

export const useConnectWallet = () => {
  const tonAddress = useTonAddress()
  const { isConnected } = useAccount()
  const [tonConnectUI] = useTonConnectUI()
  const { getMainChain, removeMainChain } = useStorage()

  const { disconnect } = useDisconnect({
    mutation: {
      onError: ({ message }) => reportException(message),
    },
  })

  // check if wallet is connected
  const walletIsConnected = () => {
    if (tonAddress !== '' || isConnected) {
      return true
    }
    return false
  }

  // logout wallet
  const walletDisconnect = () => {
    if (getMainChain() === 'evm') {
      disconnect()
    } else if (getMainChain() === 'ton') {
      tonConnectUI.disconnect()
    }
    // more...

    removeMainChain()
  }

  return { walletIsConnected, walletDisconnect }
}
