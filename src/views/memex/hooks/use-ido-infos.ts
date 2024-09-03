import { useAccount, useReadContracts } from 'wagmi'
import { Address, zeroAddress } from 'viem'

import { MemexIdeaItem } from '@/api/memex/types'
import { memexFactoryAbiMap } from '@/contract/abi/memex/factory'
import { useChainsStore } from '@/stores/use-chains-store'
import { getContractsEnabled } from '@/utils/contract'

export interface IdoInfo {
  owner: Address
  token: Address
  likeCount: bigint
  maxCount: bigint
  ETHAmountOfLike: bigint
  ownerRatio: bigint
  userAmount: bigint
  alreadyClaimCount: bigint
  startTime: bigint
  endTime: bigint
  overTime: bigint
  waitingTime: bigint
  initAmountIn: bigint
  isCanClaimToken: boolean
  isClaimToken: boolean
  isLike: boolean
  isInitWithdrawETH: boolean
  isDeploy: boolean
  isOver: boolean
  isHasInitWithdraw: boolean
  isCanWithdraw: boolean
  isWithdrawETH: boolean
}

export const useIdoInfos = (ideas: MemexIdeaItem[]) => {
  const { address } = useAccount()
  const { getChainId } = useChainsStore()

  const {
    data: idoInfos = [],
    isLoading: isLoadingIdoInfos,
    refetch: refetchIdoInfos,
  } = useReadContracts({
    contracts: ideas.map((idea) => ({
      abi: memexFactoryAbiMap[idea.memex_version],
      address: idea.factory_address as Address,
      chainId: getChainId(idea.chain),
      functionName: 'getIdoInfos',
      args: [[idea.hash], address || zeroAddress],
    })),
    query: {
      enabled: getContractsEnabled(ideas, 'memex_version', 'factory_address'),
      select: (data) =>
        // @ts-ignore
        data.flatMap((d) => d.result) as (IdoInfo | undefined)[],
      refetchInterval: 5_000,
    },
  })

  return {
    idoInfos,
    isLoadingIdoInfos,
    refetchIdoInfos,
  }
}
