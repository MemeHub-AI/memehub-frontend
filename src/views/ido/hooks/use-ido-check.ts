import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { useAccount, useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { kolNftAbi } from '@/contract/v3/abi/kol-nft'
import { v3Addr } from '@/contract/v3/address'
import { useQuery } from '@tanstack/react-query'
import { allianceApi } from '@/api/alliance'
import { randomBy } from '@/utils/math'

export const useIdoCheck = () => {
  const { chainId = 0, address } = useAccount()
  const { kolNft, exchangeNft } = v3Addr[chainId] ?? {}

  const { data: kolTokenId = BI_ZERO } = useReadContract({
    abi: kolNftAbi,
    address: kolNft,
    functionName: 'userOfId',
    args: [address!],
    query: { enabled: !!address },
  })
  const isKol = !BigNumber(kolTokenId.toString()).isZero()

  const { data: { communities } = {} } = useQuery({
    queryKey: [allianceApi.getKolCommunities.name],
    queryFn: () => allianceApi.getKolCommunities(),
    select: ({ data }) => ({
      total: data.count,
      communities: data.results,
    }),
  })
  const community = useMemo(() => randomBy(communities), [communities])

  console.log('community', community)

  return {
    kolTokenId,
    isKol,
    community,
  }
}
