import { useAccount, useAccountEffect, useDisconnect } from 'wagmi'
import { useStorage } from './use-storage'
import { reportException } from '@/errors'

export const useConnectWallet = () => {
  const { isConnected } = useAccount()
  // const { publicKey } = useWallet()

  // TODO: Add more networks
  const { getMainChain, removeMainChain } = useStorage()
  // const { onButtonClick } = useWalletDisconnectButton()

  const { disconnect } = useDisconnect({
    mutation: {
      onError: ({ message }) => reportException(message),
    },
  })

  // monitor evm's wallet disconnect
  useAccountEffect({
    onDisconnect() {
      removeMainChain()
    },
  })

  // check if wallet is connected
  // const walletIsConnected = () => {
  //   if (isConnected || publicKey) {
  //     return true
  //   }
  //   return false
  // }

  // logout wallet
  const walletDisconnect = () => {
    disconnect()
    if (getMainChain() === 'evm') {
      disconnect()
    } else if (getMainChain() === 'solana') {
      // onButtonClick!()
    }
    // more...
  }

  return {
    walletDisconnect,
  }
}
