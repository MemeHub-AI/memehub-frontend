import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { useTradeSearchParams } from './use-search-params'
import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'
import { useAirdropInfo } from '@/views/airdrop/hooks/use-airdrop-info'
import { useAirdrop } from './trade-v1/use-airdrop'
import { MarketType } from '@/api/token/types'
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
    enabled: false,
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
    enabled: !!chainName && !!tokenAddr,
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

  const kolAirdropInfo = useAirdropInfo(
    MarketType.Kol,
    kol?.chain,
    kol?.distribution_id
  )
  const communitiesAirdropInfo = useAirdropInfo(
    MarketType.Community,
    communities?.chain,
    communities?.distribution_id
  )

  const kolAirdrop = useAirdrop(
    kol?.distribution_id!,
    `${kol?.airdrop_type}`,
    () => {
      kolAirdropInfo?.refetch()
      kolAirdropInfo?.refetchIsClaimed()
    }
  )

  const communitiesAirdrop = useAirdrop(
    communities?.distribution_id!,
    `${communities?.airdrop_type}`,
    () => {
      communitiesAirdropInfo?.refetch()
      communitiesAirdropInfo?.refetchIsClaimed()
    }
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
      kolAirdropInfo,
      communitiesAirdropInfo,
      kolAirdrop,
      communitiesAirdrop,
    },
  }
}
