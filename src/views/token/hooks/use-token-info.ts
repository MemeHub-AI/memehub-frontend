import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { useTradeSearchParams } from './use-search-params'
import { ApiCode, ApiResponse } from '@/api/types'
import { useChainsStore } from '@/stores/use-chains-store'
import { useTokenDetails } from '@/hooks/use-token-details'

export const useTokenInfo = () => {
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { chainsMap } = useChainsStore()
  const chainId = +(chainsMap[chainName]?.id ?? 0)

  const {
    data: tokenInfo,
    error: tokenInfoErr,
    isLoading: isLoadingTokenInfo,
    isFetching: isFetchingTokenInfo,
    isRefetching: isRefetchingTokenInfo,
    // Be careful, chart will be recreate when refetch.
    refetch: refetchInfo,
  } = useQuery({
    queryKey: [tokenApi.details.name, chainName, tokenAddr],
    queryFn: () => tokenApi.details(chainName, tokenAddr),
    retry: (count, e?: ApiResponse) => {
      if (e?.code === ApiCode.NotFound) return false
      return count < 2
    },
    select: ({ data }) => data,
    refetchOnWindowFocus: false,
    enabled: !!chainName && !!tokenAddr,
  })
  const isNotFound = tokenInfoErr?.code === ApiCode.NotFound

  const { isLoadingDetails, ...tokenDetails } = useTokenDetails(
    tokenAddr,
    chainId,
    '0.2.0' // TODO: should use `tokenInfo`
  )

  return {
    tokenInfo,
    isLoadingTokenInfo: isLoadingTokenInfo || isLoadingDetails,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    isNotFound,
    refetchInfo,
    isLoadingDetails,
    ...tokenDetails,
  }
}
