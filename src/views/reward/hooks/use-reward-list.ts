import { useMemo } from 'react'

import { useChainsStore } from '@/stores/use-chains-store'
import { wagmiConfig } from '@/config/wagmi'

export const useRewardList = () => {
  const { chains, findChains } = useChainsStore()
  const rewardList = useMemo(
    () => findChains(wagmiConfig.chains.map((c) => c.id)),
    [wagmiConfig]
  )

  return {
    rewardList,
    isLoading: !chains,
  }
}
