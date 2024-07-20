import { useAccount, useSwitchChain } from 'wagmi'

import { useWalletStore } from '@/stores/use-wallet-store'

export const useCheckAccount = () => {
  const { address, isConnected, chainId: walletChainId } = useAccount()
  const { setConnectOpen } = useWalletStore()
  const { switchChainAsync } = useSwitchChain()

  const checkForConnect = () => {
    if (!isConnected || !address) {
      setConnectOpen(true)
      return false
    }
    return true
  }

  const checkForChain = async (chainId: number | string | undefined) => {
    if (!chainId) return false

    chainId = +chainId
    if (walletChainId === chainId) return true

    try {
      await switchChainAsync({ chainId })
      return true
    } catch (error) {
      return false
    }
  }

  return {
    address,
    isConnected,
    walletChainId,
    checkForConnect,
    checkForChain,
  }
}
