import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { tokenApi } from '@/api/token'
import { ApiCode, ApiResponse } from '@/api/types'
import { useTokenDetails } from '@/hooks/use-token-details'
import { TokenType } from '@/enums/token'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useTokenInfo = (tokenAddr: Address, chainName: string) => {
  const { chainId } = useChainInfo(chainName)
  const [fallbackGraduated, setFallbackGraduated] = useState<Address>()

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
  const { coin_type, coin_version, bond_version, bond_address } =
    tokenInfo ?? {}
  const isNotFound = tokenInfoErr?.code === ApiCode.NotFound
  const isIdoToken = coin_type === TokenType.Ido

  const { isLoadingDetails, refetchDetails, ...tokenDetails } = useTokenDetails(
    chainId,
    coin_version,
    isIdoToken || isNotFound ? undefined : tokenAddr,
    bond_version,
    bond_address
  )
  const { progress, tokenLeftAmount, reserveTotalAmount } = tokenDetails
  const isGraduated = tokenDetails.isGraduated || isIdoToken
  const graduatedPool = tokenInfo?.graduated_pool || fallbackGraduated

  const refetchTokenInfo = () => {
    refetchInfo()
    refetchDetails()
  }

  return {
    tokenInfo,
    isLoadingTokenInfo: isLoadingTokenInfo || isLoadingDetails,
    isFetchingTokenInfo,
    isRefetchingTokenInfo,
    isNotFound,
    isLoadingDetails,
    refetchTokenInfo,
    refetchDetails,
    graduatedPool,
    setFallbackGraduated,

    ...tokenDetails,
    progress,
    isGraduated,
    tokenLeft: tokenLeftAmount,
    reserveTotal: reserveTotalAmount,
    isIdoToken,
  }
}
