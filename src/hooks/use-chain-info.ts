import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import type { ChainId } from '@/config/wagmi'
import { useChainsStore } from '@/stores/use-chains-store'
import { ChainData } from '@/api/chain/type'

export const useChainInfo = (nameOrId?: string | number) => {
  const { query } = useRouter()
  const { chainId: accountChainId } = useAccount()
  const { chains, findChain } = useChainsStore()
  const [chain, setChain] = useState<ChainData | undefined>(undefined)
  const chainName = chain?.name
  const chainId = (chain?.id ? Number(chain.id) : undefined) as ChainId

  useEffect(() => {
    if (isEmpty(chains)) return
    setChain(findChain(String(nameOrId || query.chain || accountChainId)))
  }, [chains])

  return {
    chainInfo: chain,
    chainName,
    chainId,
  }
}
