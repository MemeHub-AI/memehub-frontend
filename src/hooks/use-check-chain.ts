import { useChainId, useSwitchChain } from 'wagmi'

export const useCheckChain = () => {
  const { switchChainAsync } = useSwitchChain()
  const accountChainId = useChainId()

  const checkForChain = async (chainId: number) => {
    if (accountChainId === chainId) return true

    try {
      await switchChainAsync({ chainId })
      return true
    } catch (error) {
      return false
    }
  }

  return {
    checkForChain,
  }
}
