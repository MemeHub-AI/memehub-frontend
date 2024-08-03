import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useReadContract, useReadContracts } from 'wagmi'
import { type Address } from 'viem'

import { tokenApi } from '@/api/token'
import { useTradeSearchParams } from './use-search-params'
import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'
import { useAirdropInfo } from '@/views/airdrop/hooks/use-airdrop-info'
import { useAirdrop } from './trade-v1/use-airdrop'
import { MarketType } from '@/api/token/types'
import { ApiCode, ApiResponse } from '@/api/types'
import { tokenAbiMap } from '@/contract/abi/token'
import { useChainsStore } from '@/stores/use-chains-store'

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

  const tokenConfig = {
    abi: tokenAbiMap['0.2.0'], // TODO: use tokenInfo version
    address: tokenAddr,
    chainId,
  } as const

  const {
    data: [tokenVersion, bcVersion, airdropVersion, bcAddr, airdropAddr] = [],
    isLoading: isLoadingVersions,
    refetch: refetchVersions,
  } = useReadContracts({
    contracts: [
      { ...tokenConfig, functionName: 'versions' },
      { ...tokenConfig, functionName: 'bondVersion' },
      { ...tokenConfig, functionName: 'distributorVersion' },
      { ...tokenConfig, functionName: 'bond' },
      { ...tokenConfig, functionName: 'distributor' },
    ],
    query: {
      select: (data) => data.map((v) => v.result),
    },
  })

  const {
    data: tokenMetadata,
    isLoading: isLoadingMetadata,
    refetch: refetchMetadata,
  } = useReadContract({
    ...tokenConfig,
    functionName: 'getMetadata',
  })

  // airdrop related
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
    isLoadingTokenInfo:
      isLoadingTokenInfo || isLoadingVersions || isLoadingMetadata,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    isNotFound,
    refetchInfo,
    refetchVersions,
    refetchMetadata,
    tokenVersion,
    bcVersion,
    airdropVersion,
    bcAddr: bcAddr as Address | undefined,
    airdropAddr: airdropAddr as Address | undefined,
    tokenMetadata,

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
