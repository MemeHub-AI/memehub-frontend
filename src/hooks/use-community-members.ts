import { isEmpty } from 'lodash'
import { useReadContracts } from 'wagmi'
import { bsc, base, blast } from 'wagmi/chains'

import { exchangeNftAbi } from '@/contract/v3/abi/exchange-nft'
import { v3Addr } from '@/contract/v3/address'

const chains = [bsc, base, blast]

export const useCommunityMembers = (id?: string) => {
  const { data = [] } = useReadContracts({
    contracts: chains.map((c) => ({
      abi: exchangeNftAbi,
      address: v3Addr[c.id]?.exchangeNft,
      functionName: 'idOfAmount',
      args: [id],
    })),
    query: {
      enabled: !!id,
      select: (data) => data.map((d) => Number(d.result || 0)),
    },
  })
  const members = isEmpty(data) ? 0 : Math.max(...data)

  return {
    members,
  }
}
