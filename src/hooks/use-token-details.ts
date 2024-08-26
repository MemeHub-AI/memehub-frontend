import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther, zeroAddress } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { tokenAbiMap, TokenVersion } from '@/contract/abi/token'
import { BI_ZERO } from '@/constants/number'
import { bcAbiMap, BcVersion } from '@/contract/abi/bonding-curve'
import { DistributorVersion } from '@/contract/abi/distributor'

export const useTokenDetails = (
  chainId: number,
  tokenVersion: TokenVersion | undefined,
  tokenAddr: string | undefined
) => {
  const tokenConfig = {
    abi: tokenAbiMap[tokenVersion!],
    address: tokenAddr as Address,
    chainId,
  } as const
  const enabled = !!tokenAddr && !!chainId && !!tokenVersion

  const {
    data: [version, bcVersion, airdropVersion, bcAddr, airdropAddr] = [],
    isLoading,
    refetch,
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
      enabled,
    },
  })

  const bcConfig = {
    abi: bcAbiMap[bcVersion as BcVersion],
    address: bcAddr as Address,
    chainId,
  }

  const {
    data: tokenMetadata,
    isLoading: isLoadingMetadata,
    refetch: refetchMetadata,
  } = useReadContract({
    ...tokenConfig,
    functionName: 'getMetadata',
    query: { enabled },
  })

  const { data: totalSupply_ = BI_ZERO } = useReadContract({
    ...tokenConfig,
    functionName: 'totalSupply',
    query: { enabled },
  })

  const {
    data: bcTotalSupply_ = BI_ZERO,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
    refetch: refetchTotal,
  } = useReadContract({
    ...bcConfig,
    functionName: 'maxSupply_',
    query: { enabled: !!bcAddr },
  })
  const { data: pools = [], refetch: refetchPools } = useReadContract({
    ...bcConfig,
    functionName: 'pools_',
    args: [tokenAddr as Address],
    query: {
      enabled: !!bcAddr && !!tokenAddr,
      refetchInterval: 10_000, // refresh each 10s.
    },
  })
  const [
    ,
    ,
    tokenLeft = BI_ZERO,
    ,
    reserveTotal = BI_ZERO,
    ,
    ,
    ,
    ,
    headmaster = zeroAddress,
  ] = pools
  const isGraduated = headmaster !== zeroAddress
  const tokenLeftAmount = formatEther(tokenLeft)
  const reserveTotalAmount = formatEther(reserveTotal)
  const bcTotalSupply = formatEther(bcTotalSupply_)
  const totalSupply = formatEther(totalSupply_)

  const progress = useMemo(() => {
    if (BigNumber(bcTotalSupply).isZero()) return '0.00'
    if (isGraduated) return '100.00'
    if (!isGraduated && BigNumber(tokenLeftAmount).isZero()) return '0.00'

    return BigNumber(bcTotalSupply)
      .minus(tokenLeftAmount)
      .div(bcTotalSupply)
      .multipliedBy(100)
      .toFixed(2)
  }, [bcTotalSupply, tokenLeftAmount, isGraduated])

  const refetchDetails = () => {
    refetch()
    refetchMetadata()
    refetchPools()
  }

  return {
    tokenVersion,
    bcVersion: bcVersion as BcVersion | undefined,
    airdropVersion: airdropVersion as DistributorVersion | undefined,
    bcAddr: bcAddr as Address | undefined,
    airdropAddr: airdropAddr as Address | undefined,
    tokenMetadata,
    isLoadingDetails: isLoading || isLoadingMetadata,
    totalSupply,
    refetchDetails,

    progress,
    isGraduated,
    tokenLeftAmount,
    reserveTotalAmount,
  }
}
