import { BigNumber } from 'bignumber.js'
import { useAccount, useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { kolNftAbi } from '@/contract/v3/abi/kol-nft'
import { v3Addr } from '@/contract/v3/address'
import { useQuery } from '@tanstack/react-query'
import { allianceApi } from '@/api/alliance'
import { useIdoContext } from '@/contexts/ido'
import { exchangeNftAbi } from '@/contract/v3/abi/exchange-nft'
import { parseHash } from '@/utils/contract'
import { COMMUNITY_IDX } from '@/config/nft'

export const useIdoCheck = () => {
  const { address } = useAccount()
  const { chainId } = useIdoContext()
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

  // TODO: use `useCommunityNft` instead.
  const { data: communityId = BI_ZERO } = useReadContract({
    abi: exchangeNftAbi,
    address: exchangeNft,
    chainId,
    functionName: 'isClaimedOfId',
    args: [address!, BigInt(COMMUNITY_IDX)],
    query: { enabled: !isKol },
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
    enabled: !cId.isZero() && !isKol,
  })

  return {
    kolTokenId,
    isKol,
    community,
  }
}
