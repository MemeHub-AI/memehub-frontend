import { useRouter } from 'next/router'
import { useReadContracts } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { continousTokenAbi } from '@/contract/abi/continous-token'
import { tokenApi } from '@/api/token'
import { useChainsStore } from '@/stores/use-chains-store'

export const useTokenInfo = () => {
  const { findChain } = useChainsStore()
  const { query } = useRouter()
  const chainName = (query.chain || '') as string
  const tokenAddr = (query.address || '') as Address
  const chain = findChain(chainName)

  // Query token amounts.
  const {
    data = [],
    refetch: refetchInfo,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
  } = useReadContracts({
    contracts: [
      {
        abi: continousTokenAbi,
        address: tokenAddr,
        chainId: Number(chain?.id),
        functionName: 'ETH_AMOUNT',
      },
      {
        abi: continousTokenAbi,
        address: tokenAddr,
        chainId: Number(chain?.id),
        functionName: 'raiseEthAmount',
      },
    ],
    query: { enabled: !!tokenAddr },
  })
  const weiTotal = data[0]?.result || BigInt(0)
  const weiCurrent = data[1]?.result || BigInt(0)

  // Query token details from api.
  const {
    data: { data: tokenInfo } = {},
    isLoading: isLoadingTokenInfo,
    isFetching: isFetchingTokenInfo,
    isRefetching: isRefetchingTokenInfo,
  } = useQuery({
    enabled: !!tokenAddr,
    queryKey: [tokenApi.details.name, tokenAddr],
    queryFn: () => tokenApi.details(tokenAddr),
    refetchOnWindowFocus: false,
  })

  return {
    tokenInfo,
    totalToken: formatEther(weiTotal),
    currentToken: formatEther(weiCurrent),
    isLoadingProgress,
    isFetchingProgress,
    isLoadingTokenInfo,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    refetchInfo,
  }
}
