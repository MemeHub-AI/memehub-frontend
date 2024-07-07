import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { useTradeSearchParams } from './use-search-params'
import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'
import { ApiCode, ApiResponse } from '@/api/types'

export const useTokenInfo = () => {
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { userInfo } = useUserStore()

  const { data: { data = [] } = {} } = useQuery({
    queryKey: [airdropApi.getDetails.name, chainName, tokenAddr, userInfo?.id],
    queryFn: () => {
      if (userInfo?.id == null) return Promise.reject()

      return airdropApi.getDetails({
        chain: chainName,
        token_address: tokenAddr,
      })
    },
  })

  const {
    data: { data: tokenInfo } = {},
    error,
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
    retry: (count, e?: ApiResponse) => {
      if (e?.code === ApiCode.NotFound) return false
      return count < 2
    },
  })
  const isNotFound = error?.code === ApiCode.NotFound

  const [kol, communities, isOnlyOne] = useMemo(
    () => [
      data?.find((a) => a.kol_name),
      data?.find((a) => a.community_name),
      data?.length === 1,
    ],
    [data]
  )

  return {
    tokenInfo,
    isLoadingTokenInfo,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    isNotFound,
    refetchInfo,
    airdrop: {
      data,
      kol,
      communities,
      isOnlyOne,
    },
  }
}
