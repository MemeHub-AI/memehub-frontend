import { useQuery } from '@tanstack/react-query'
import { formatEther, zeroAddress } from 'viem'

import { tokenApi } from '@/api/token'
import { useTradeSearchParams } from './use-search-params'
import { ApiCode, ApiResponse } from '@/api/types'
import { useChainsStore } from '@/stores/use-chains-store'
import { useTokenDetails } from '@/hooks/use-token-details'
import { TokenVersion } from '@/contract/abi/token'
import { idoTrumpCard } from '@/config/ido'
import { useReadContract } from 'wagmi'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { BI_ZERO } from '@/constants/number'

export const useTokenInfo = () => {
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { evmChainsMap } = useChainsStore()
  const chainId = +(evmChainsMap[chainName]?.id ?? 0)

  const {
    data: tokenInfo,
    error: tokenInfoErr,
    isLoading: isLoadingTokenInfo,
    isFetching: isFetchingTokenInfo,
    isRefetching: isRefetchingTokenInfo,
    // Be careful, chart will be recreate when refetch.
    refetch: refetchInfo,
  } = useQuery({
    queryKey: [tokenApi.getDetail.name, chainName, tokenAddr],
    queryFn: () => tokenApi.getDetail(chainName, tokenAddr),
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
    // TODO: adapt ido token.
    tokenAddr === idoTrumpCard.address || isNotFound ? undefined : tokenAddr,
    chainId,
    '0.2.0' // TODO: should use `tokenInfo`
  )
  const { bcVersion, bcAddr } = tokenDetails

  const { data: pools = [], refetch: refetchPools } = useReadContract({
    abi: bcAbiMap[bcVersion!],
    address: bcAddr!,
    chainId,
    functionName: 'pools_',
    args: [tokenAddr],
    query: {
      enabled: !!bcAddr && !!tokenAddr,
      refetchInterval: 10_000, // refresh each 10s.
    },
  })
  const [
    ,
    tokenLeft = BI_ZERO,
    ,
    reserveTotal = BI_ZERO,
    ,
    ,
    ,
    headmaster = zeroAddress,
  ] = pools
  const isGraduated = headmaster !== zeroAddress

  const refetchTokenInfo = () => {
    refetchInfo()
    refetchPools()
  }

  return {
    tokenInfo,
    isLoadingTokenInfo: isLoadingTokenInfo || isLoadingDetails,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    isNotFound,
    isLoadingDetails,
    ...tokenDetails,
    isGraduated,
    refetchTokenInfo,
    tokenLeft: formatEther(tokenLeft),
    reserveTotal: formatEther(reserveTotal),
  }
}
