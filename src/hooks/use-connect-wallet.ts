import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { useAccount, useAccountEffect, useDisconnect } from 'wagmi'
import { useStorage } from './use-storage'
import { reportException } from '@/errors'
import { useWalletDisconnectButton } from '@solana/wallet-adapter-base-ui'
import { useWallet } from '@solana/wallet-adapter-react'
export const useConnectWallet = () => {
  const tonAddress = useTonAddress()
  const { isConnected } = useAccount()
  const { publicKey } = useWallet()
  // console.log('p' + publicKey)

  const [tonConnectUI] = useTonConnectUI()
  const { getMainChain, removeMainChain } = useStorage()
  const { onButtonClick } = useWalletDisconnectButton()

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
  const walletIsConnected = () => {
    if (isConnected || publicKey) {
      return true
    }
    return false
  }

  // logout wallet
  const walletDisconnect = () => {
    if (getMainChain() === 'evm') {
      disconnect()
    } else if (getMainChain() === 'ton') {
      tonConnectUI.disconnect().then(() => {
        removeMainChain()
      })
    } else if (getMainChain() === 'solana') {
      onButtonClick!()
    }
    // more...
  }

  return { walletIsConnected, walletDisconnect }
}
