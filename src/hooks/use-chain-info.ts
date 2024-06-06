import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import { useChainsStore } from '@/stores/use-chains-store'

export const useChainInfo = (nameOrId?: string | number) => {
  const { query } = useRouter()
  const { chain: accountChain } = useAccount()
  const { findChain } = useChainsStore()

  const chain = findChain(
    String(nameOrId || query.chain || accountChain?.id || '')
  )

  return {
    chainName: chain?.name || '',
    chainId: Number(chain?.id || 0),
  }
}
