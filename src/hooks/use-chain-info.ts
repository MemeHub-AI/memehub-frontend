import { useMemo } from 'react'

import { type ConfigChainId } from '@/config/wagmi'
import { useChainsStore } from '@/stores/use-chains-store'

/**
 * Getting chain info from `useChainStore`,
 * compatible all chains, not just EVM.
 */
export const useChainInfo = (name: string | null | undefined) => {
  const { chains, chainsMap, getChainId } = useChainsStore()

  const chianInfos = useMemo(() => {
    const chain = chainsMap[name || '']
    const chainName = chain?.name || ''
    const chainId = Number(chain?.id || 0)
    const configChainId = chainId as ConfigChainId

    return {
      chain,
      chainName,
      chainId,
      configChainId,
    }
  }, [chains, chainsMap, name])

  return {
    ...chianInfos,
    getChainId,
  }
}
