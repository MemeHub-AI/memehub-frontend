import { BigNumber } from 'bignumber.js'
import { useAccount, useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { kolNftAbi } from '@/contract/v3/abi/kol-nft'
import { v3Addr } from '@/contract/v3/address'
import { useQuery } from '@tanstack/react-query'
import { allianceApi } from '@/api/alliance'
import { useIdoContext } from '@/contexts/ido'
import { exchangeNftAbi } from '@/contract/v3/abi/exchange-nft'
import { addPrefix0x } from '@/utils/contract'

let communityIdx = 1

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

  const { data: communityId = BI_ZERO } = useReadContract({
    abi: exchangeNftAbi,
    address: exchangeNft,
    chainId,
    functionName: 'isClaimedOfId',
    args: [address!, BigInt(communityIdx)],
    query: { enabled: !isKol },
  })
  const cId = BigNumber(communityId.toString())

  const { data: community } = useQuery({
    queryKey: [allianceApi.getCommunityDetail.name, cId.toString(), address],
    queryFn: () => {
      return allianceApi.getCommunityDetail({
        identity: addPrefix0x([communityId.toString(16)])[0],
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
