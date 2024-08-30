import { useMemo } from 'react'

import { useChainsStore } from '@/stores/use-chains-store'
import { wagmiConfig } from '@/config/wagmi'

export const useRewardCards = () => {
  const { chains, findChains } = useChainsStore()
  const rewardList = useMemo(
    () => findChains(wagmiConfig.chains.map((c) => c.id)),
    [wagmiConfig, chains] // Must include chains.
  )

  return {
    rewardList,
    isLoading: !chains,
  }
}
