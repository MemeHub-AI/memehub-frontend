import { useAccount, useAccountEffect, useDisconnect } from 'wagmi'
import { reportException } from '@/errors'

export const useConnectWallet = () => {
  const { isConnected } = useAccount()
  // const { publicKey } = useWallet()

  // TODO: Add more networks
  // const { onButtonClick } = useWalletDisconnectButton()

  const { disconnect } = useDisconnect({
    mutation: {
      onError: ({ message }) => reportException(message),
    },
  })

  // logout wallet
  const walletDisconnect = () => {
    disconnect()
  }

  return {
    walletDisconnect,
  }
}
