import { useRouter } from 'next/router'
import { useReadContracts } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { continousTokenAbi } from '@/contract/continous-token'
import { tokenApi } from '@/api/token'

export const useTokenInfo = () => {
  const { query } = useRouter()
  const token = (query.address || '') as Address
  const id = (query.id || '') as string

  // Query token amounts.
  const { data = [], refetch: refetchInfo } = useReadContracts({
    contracts: [
      {
        abi: continousTokenAbi,
        address: token,
        functionName: 'ETH_AMOUNT',
      },
      {
        abi: continousTokenAbi,
        address: token,
        functionName: 'raiseEthAmount',
      },
    ],
    query: { enabled: !!token },
  })
  const weiTotal = data[0]?.result || BigInt(0)
  const weiCurrent = data[1]?.result || BigInt(0)

  // Query token details from api.
  const { data: { data: tokenInfo } = {} } = useQuery({
    enabled: !!id,
    queryKey: [tokenApi.details.name, id],
    queryFn: () => tokenApi.details(id),
  })

  return {
    tokenInfo,
    totalToken: formatEther(weiTotal),
    currentToken: formatEther(weiCurrent),
    refetchInfo,
  }
}
