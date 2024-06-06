import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

import { tokenApi } from '@/api/token'

export const useTokenInfo = () => {
  const { query } = useRouter()
  const tokenAddr = (query.address || '') as Address

  const {
    data: { data: tokenInfo } = {},
    isLoading: isLoadingTokenInfo,
    isFetching: isFetchingTokenInfo,
    isRefetching: isRefetchingTokenInfo,
    // Be careful, chart will be recreate when refetch.
    refetch: refetchInfo,
  } = useQuery({
    enabled: !!tokenAddr,
    queryKey: [tokenApi.details.name, tokenAddr],
    queryFn: () => tokenApi.details(tokenAddr),
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
