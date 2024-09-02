import { useMemo } from 'react'

import type { ConfigChainId } from '@/config/wagmi'
import { useChainsStore } from '@/stores/use-chains-store'
import { Network } from '@/enums/contract'

/**
 * Getting chain info from `useChainStore`,
 * compatible all chains, not just EVM.
 */
export const useChainInfo = (chainName_: string | null | undefined) => {
  const { chains, chainsMap, getChainId } = useChainsStore()

  const chianInfo = useMemo(() => {
    const chain = chainsMap[chainName_ || '']
    const chainName = chain?.name || ''
    const chainId = Number(chain?.id || 0)
    const configChainId = chainId as ConfigChainId
    const network = chain?.network || Network.Evm

    return {
      ...chain,
      chain,
      chainName,
      chainId,
      configChainId,
      network,
    }
  }, [chains, chainsMap, chainName_])

  return {
    ...chianInfo,
    getChainId,
  }
}
