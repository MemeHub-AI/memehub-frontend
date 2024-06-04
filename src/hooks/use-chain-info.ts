import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import { useChainsStore } from '@/stores/use-chains-store'

export const useChainInfo = () => {
  const { query } = useRouter()
  const { chain } = useAccount()
  const { findChain } = useChainsStore()

  const chainName = (query.chain || chain?.name || '') as string
  const chainId = Number(findChain(chainName)?.id || 0)

  return {
    chainName,
    chainId,
  }
}
