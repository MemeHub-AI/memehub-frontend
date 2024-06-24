import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

import { useChainsStore } from '@/stores/use-chains-store'

export const useRewardList = () => {
  const { findChains } = useChainsStore()
  const rewardList = findChains([bscTestnet.id, opBNBTestnet.id])

  return {
    rewardList,
  }
}
