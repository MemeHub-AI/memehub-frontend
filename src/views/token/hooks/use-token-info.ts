import { useRouter } from 'next/router'
import { useReadContracts } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { continousTokenAbi } from '@/contract/abi/continous-token'
import { tokenApi } from '@/api/token'

export const useTokenInfo = () => {
  const { query } = useRouter()
  const tokenAddr = (query.address || '') as Address
  const chainId = Number(query.chain_id || 0)

  // Query token amounts.
  const { data = [], refetch: refetchInfo } = useReadContracts({
    contracts: [
      {
        abi: continousTokenAbi,
        address: tokenAddr,
        chainId,
        functionName: 'ETH_AMOUNT',
      },
      {
        abi: continousTokenAbi,
        address: tokenAddr,
        chainId,
        functionName: 'raiseEthAmount',
      },
    ],
    query: { enabled: !!tokenAddr },
  })
  const weiTotal = data[0]?.result || BigInt(0)
  const weiCurrent = data[1]?.result || BigInt(0)

  // Query token details from api.
  const { data: { data: tokenInfo } = {} } = useQuery({
    enabled: !!tokenAddr,
    queryKey: [tokenApi.details.name, tokenAddr],
    queryFn: () => tokenApi.details(tokenAddr),
  })

  return {
    tokenInfo,
    totalToken: formatEther(weiTotal),
    currentToken: formatEther(weiCurrent),
    refetchInfo,
  }
}
