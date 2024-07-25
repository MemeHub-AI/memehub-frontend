import { useAccount, useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'

import { BI_ZERO } from '@/constants/number'
import { exchangeNftAbi } from '@/contract/v3/abi/exchange-nft'
import { v3Addr } from '@/contract/v3/address'
import { COMMUNITY_IDX } from '@/config/ido'
import { allianceApi } from '@/api/alliance'
import { parseHash } from '@/utils/contract'

export const useCommunityNft = (chainId: number, enabled = true) => {
  const { exchangeNft } = v3Addr[chainId] ?? {}
  const { address } = useAccount()

  const { data: communityId = BI_ZERO } = useReadContract({
    abi: exchangeNftAbi,
    address: exchangeNft,
    chainId,
    functionName: 'isClaimedOfId',
    args: [address!, BigInt(COMMUNITY_IDX)],
    query: { enabled },
  })
  const cId = BigNumber(communityId.toString())

  const { data: community } = useQuery({
    queryKey: [allianceApi.getCommunityDetail.name, cId.toString(), address],
    queryFn: () => {
      return allianceApi.getCommunityDetail({
        identity: parseHash(communityId),
      })
    },
    select: ({ data }) => data,
    retry: (count) => count < 3,
    enabled: cId.gt(0) && enabled,
  })

  return {
    communityId,
    community,
  }
}
