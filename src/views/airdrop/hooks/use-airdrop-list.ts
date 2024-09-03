import { useInfiniteQuery } from '@tanstack/react-query'
import { useAccount, useReadContracts } from 'wagmi'
import { Address, zeroAddress } from 'viem'

import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'
import { distributorAbiMap } from '@/contract/abi/distributor'
import { useChainsStore } from '@/stores/use-chains-store'
import { getContractsEnabled, getEvmAirdropId } from '@/utils/contract'
import { AirdropFlag } from '@/enums/airdrop'

export interface DistributionItem {
  token: Address
  walletCountKOL: number
  walletCountCommunity: number
  claimedCountKOL: number
  claimedCountCommunity: number
  startTime: bigint
  duration: bigint
  kolFlag: AirdropFlag
  CommunityFlag: AirdropFlag
  amountPerClaimKOL: bigint
  amountPerClaimCommunity: bigint
  isClaimedKOL: boolean
  isClaimedCommunity: boolean
  isBurn: boolean
}
export const useAirdropList = () => {
  const { userInfo } = useUserStore()
  const { address } = useAccount()
  const { getChainId } = useChainsStore()

  const {
    data: { total = 0, airdrops = [] } = {},
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [airdropApi.getList.name, userInfo?.id],
    queryFn: ({ pageParam }) => airdropApi.getList({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => {
      return {
        total: pages[0].data.count,
        airdrops: pages.flatMap((p) => p?.data.results).filter(Boolean),
      }
    },
    enabled: !!userInfo,
  })

  const { data: airdropInfos = [] } = useReadContracts({
    contracts: airdrops.map((a) => ({
      abi: distributorAbiMap[a?.airdrop_version!],
      address: a?.airdrop_address as Address,
      chainId: getChainId(a?.chain),
      functionName: 'getDistributions',
      args: [[getEvmAirdropId(a)], address || zeroAddress],
    })),
    query: {
      enabled: getContractsEnabled(
        airdrops,
        'airdrop_version',
        'airdrop_address'
      ),
      select: (data) =>
        // @ts-ignore, Don't use `filter(Boolean)`, as it will disrupt the element count
        data.flatMap(({ result }) => result) as (
          | DistributionItem
          | undefined
        )[],
    },
  })

  return {
    total,
    airdrops,
    airdropInfos,
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
