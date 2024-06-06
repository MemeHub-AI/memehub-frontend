import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import { useChainsStore } from '@/stores/use-chains-store'

export const useChainInfo = (nameOrId?: string | number) => {
  const { query } = useRouter()
  const { chain: accountChain } = useAccount()
  const { findChain } = useChainsStore()

  const chainNameOrId = String(
    nameOrId || query.chain || accountChain?.name || ''
  )
  const chain = findChain(chainNameOrId)

  return {
    chainName: chain?.name,
    chainId: chain?.id,
  }
}
