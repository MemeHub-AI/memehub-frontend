import { BigNumber } from 'bignumber.js'
import { useAccount, useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { kolNftAbi } from '@/contract/abi/nft/kol-nft'
import { v3Addr } from '@/contract/address'
import { exchangeNftAbi } from '@/contract/abi/nft/exchange-nft'
import { COMMUNITY_IDX } from '@/config/nft'
import { useQuery } from '@tanstack/react-query'
import { allianceApi } from '@/api/alliance'
import { parseHash } from '@/utils/contract'

export const useIdoCheck = (chainId: number) => {
  const { address } = useAccount()
  const { kolNft, exchangeNft } = v3Addr[chainId] ?? {}

  const { data: kolTokenId = BI_ZERO } = useReadContract({
    abi: kolNftAbi,
    address: kolNft,
    chainId,
    functionName: 'userOfId',
    args: [address!],
    query: { enabled: !!address },
  })
  const isKol = !BigNumber(kolTokenId.toString()).isZero()

  const { data: communityId = BI_ZERO } = useReadContract({
    abi: exchangeNftAbi,
    address: exchangeNft,
    chainId,
    functionName: 'isClaimedOfId',
    args: [address!, BigInt(COMMUNITY_IDX)],
    query: { enabled: !!address },
  })
  const cId = BigNumber(communityId.toString())
  const isCommunity = cId.gt(0)

  const { data: community } = useQuery({
    queryKey: [allianceApi.getCommunityDetail.name, cId.toString(), address],
    queryFn: () => {
      return allianceApi.getCommunityDetail({
        identity: parseHash(communityId),
      })
    },
    select: ({ data }) => data,
    retry: (count) => count < 3,
    enabled: cId.gt(0) && !!address,
  })

  return {
    kolTokenId,
    community,
    isKol,
    isCommunity,
  }
}
