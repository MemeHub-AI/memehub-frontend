import { isEmpty } from 'lodash'
import { useReadContracts } from 'wagmi'
import { bsc, base, blast } from 'wagmi/chains'

import { exchangeNftAbi } from '@/contract/abi/nft/exchange-nft'
import { addrMap } from '@/contract/address'

const chains = [bsc, base, blast]

export const useCommunityMembers = (id?: string) => {
  const { data = [] } = useReadContracts({
    contracts: chains.map((c) => ({
      abi: exchangeNftAbi,
      address: addrMap[c.id]?.exchangeNft!,
      functionName: 'idOfAmount',
      args: [id],
    })),
    query: {
      enabled: typeof id === 'string',
      select: (data) => data.map((d) => Number(d.result || 0)),
    },
  })
  const members = isEmpty(data) ? 0 : Math.max(...data)

  return {
    members,
  }
}
