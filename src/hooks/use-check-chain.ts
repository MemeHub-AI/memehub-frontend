import { useAccount, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'

import { useWalletStore } from '@/stores/use-wallet-store'
import { useResponsive } from './use-responsive'
import { useWallet } from '@/components/wallet-connect/hooks/use-wallet'

export const useCheckAccount = () => {
  const { address, isConnected, chainId: walletChainId } = useAccount()
  const { setConnectOpen } = useWalletStore()
  const { switchChainAsync } = useSwitchChain()
  const { isMobile } = useResponsive()
  const { connectWallet } = useWallet()

  const checkForConnect = () => {
    if (!isConnected || !address) {
      if (isMobile) return connectWallet(injected())
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
