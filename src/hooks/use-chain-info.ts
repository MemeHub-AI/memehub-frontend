import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import type { ConfigChainId } from '@/config/wagmi'
import { useChainsStore } from '@/stores/use-chains-store'

export const useChainInfo = (nameOrId?: string | number) => {
  const { query } = useRouter()
  const { chainId: walletChainId = 0 } = useAccount()
  const { evmChainsMap } = useChainsStore()
  const chain = evmChainsMap[String(nameOrId || query.chain || walletChainId)]

  return {
    chainInfo: chain,
    chainName: chain?.name,
    chainId: Number(chain?.id || 0) as ConfigChainId,
    walletChainId,
  }
}
