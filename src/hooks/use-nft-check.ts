import { BigNumber } from 'bignumber.js'
import { useAccount, useReadContract } from 'wagmi'
import { useQuery } from '@tanstack/react-query'

import { BI_ZERO } from '@/constants/number'
import { kolNftAbi } from '@/contract/abi/nft/kol-nft'
import { addrMap } from '@/contract/address'
import { exchangeNftAbi } from '@/contract/abi/nft/exchange-nft'
import { COMMUNITY_NFT_IDX } from '@/config/nft'
import { allianceApi } from '@/api/alliance'
import { parseHash } from '@/utils/contract'
import { useUserStore } from '@/stores/use-user-store'

export const useNftCheck = (chainId: number) => {
  const { address } = useAccount()
  const { kolNft, exchangeNft } = addrMap[chainId] ?? {}
  const { userInfo: kol } = useUserStore()

  const { data: kolId = BI_ZERO } = useReadContract({
    abi: kolNftAbi,
    address: kolNft,
    chainId,
    functionName: 'userOfId',
    args: [address!],
    query: {
      enabled: !!address && !!kolNft && !!chainId,
    },
  })
  const isKol = kolId !== BI_ZERO

  const { data: communityId = BI_ZERO } = useReadContract({
    abi: exchangeNftAbi,
    address: exchangeNft,
    chainId,
    functionName: 'isClaimedOfId',
    args: [address!, BigInt(COMMUNITY_NFT_IDX)],
    // query: { enabled: !!address && !!exchangeNft && !!chainId },
    query: { enabled: false }, // TODO: remove it if has community airdrop
  })
  const hasCommunity = communityId !== BI_ZERO

  const { data: community } = useQuery({
    queryKey: [
      allianceApi.getCommunityDetail.name,
      communityId.toString(),
      address,
    ],
    queryFn: () => {
      return allianceApi.getCommunityDetail({
        identity: parseHash(communityId),
      })
    },
    select: ({ data }) => data,
    retry: (count) => count < 3,
    // enabled: hasCommunity && !!address,
    enabled: false, // TODO: remove it if has community airdrop
  })

  return {
    isKol,
    hasCommunity,
    kol,
    community,
  }
}
