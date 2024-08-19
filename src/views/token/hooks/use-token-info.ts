import { useQuery } from '@tanstack/react-query'
import { formatEther, zeroAddress } from 'viem'

import { tokenApi } from '@/api/token'
import { useTokenQuery } from './use-token-query'
import { ApiCode, ApiResponse } from '@/api/types'
import { useTokenDetails } from '@/hooks/use-token-details'
import { useReadContract } from 'wagmi'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { BI_ZERO } from '@/constants/number'
import { TokenVersion } from '@/contract/abi/token'
import { TokenType } from '@/enums/token'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useTokenInfo = () => {
  const { chainName, tokenAddr } = useTokenQuery()
  const { chainId } = useChainInfo(chainName)

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
    queryFn: () => tokenApi.getDetail({ chain: chainName, address: tokenAddr }),
    retry: (count, e?: ApiResponse) => {
      if (e?.code === ApiCode.NotFound) return false
      return count < 2
    },
    select: ({ data }) => data,
    refetchOnWindowFocus: false,
    enabled: !!chainName && !!tokenAddr,
  })
  const isNotFound = tokenInfoErr?.code === ApiCode.NotFound
  const isIdoToken = tokenInfo?.coin_type === TokenType.Ido

  const { isLoadingDetails, ...tokenDetails } = useTokenDetails(
    isIdoToken || isNotFound ? undefined : tokenAddr,
    chainId,
    tokenInfo?.coin_version as TokenVersion
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
  // TODO: this is an error
  const isGraduated = headmaster !== zeroAddress

  console.log('headmaster', headmaster)

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
