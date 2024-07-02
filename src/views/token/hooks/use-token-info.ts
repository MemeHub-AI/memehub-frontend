import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { useTradeSearchParams } from './use-search-params'

export const useTokenInfo = () => {
  const { chainName, tokenAddr } = useTradeSearchParams()

  const {
    data: { data: tokenInfo } = {},
    isLoading: isLoadingTokenInfo,
    isFetching: isFetchingTokenInfo,
    isRefetching: isRefetchingTokenInfo,
    // Be careful, chart will be recreate when refetch.
    refetch: refetchInfo,
  } = useQuery({
    enabled: !!tokenAddr,
    queryKey: [tokenApi.details.name, chainName, tokenAddr],
    queryFn: () => tokenApi.details(chainName, tokenAddr),
    refetchOnWindowFocus: false,
  })

  return {
    tokenInfo,
    isLoadingTokenInfo,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    refetchInfo,
  }
}
