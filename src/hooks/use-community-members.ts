import { isEmpty } from 'lodash'
import { useReadContracts } from 'wagmi'
import { bsc, base, blast } from 'wagmi/chains'

import { exchangeNftAbi } from '@/contract/exchange-nft/abi'
import { exchangeAddr } from '@/contract/exchange-nft/address'

const chains = [bsc, base, blast]

export const useCommunityMembers = (id?: string) => {
  const { data = [] } = useReadContracts({
    contracts: chains.map((c) => ({
      abi: exchangeNftAbi,
      address: exchangeAddr[c.id],
      functionName: 'idOfAmount',
      args: [id],
    })),
    query: {
      enabled: !!id,
      select: (data) => data.map((d) => Number(d.result || 0)),
    },
  })

  return {
    members: isEmpty(data) ? 0 : Math.max(...data),
  }
}
