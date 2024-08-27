import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther, zeroAddress } from 'viem'
import { useReadContract } from 'wagmi'

import { tokenAbiMap, TokenVersion } from '@/contract/abi/token'
import { BI_ZERO } from '@/constants/number'
import { bcAbiMap, BcVersion } from '@/contract/abi/bonding-curve'

export const useTokenDetails = (
  chainId: number,
  tokenVersion: TokenVersion | undefined,
  tokenAddr: string | undefined,
  bcVersion: BcVersion | undefined,
  bcAddr: string | undefined
) => {
  const tokenConfig = {
    abi: tokenAbiMap[tokenVersion!],
    address: tokenAddr as Address,
    chainId,
  } as const
  const enabled = !!chainId && !!tokenAddr && !!tokenVersion

  const {
    data: tokenMetadata,
    isLoading: isLoadingMetadata,
    refetch: refetchMetadata,
  } = useReadContract({
    ...tokenConfig,
    functionName: 'getMetadata',
    query: { enabled },
  })

  const { data: pools = [], refetch: refetchPools } = useReadContract({
    abi: bcAbiMap[bcVersion!],
    address: bcAddr as Address,
    chainId,
    functionName: 'pools_',
    args: [tokenAddr as Address],
    query: {
      enabled: !!tokenAddr,
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
    maxSupply = BI_ZERO,
  ] = pools
  const isGraduated = headmaster !== zeroAddress
  const tokenLeftAmount = formatEther(tokenLeft)
  const reserveTotalAmount = formatEther(reserveTotal)
  const tokenMaxSupply = formatEther(maxSupply)

  const progress = useMemo(() => {
    if (isGraduated) return '100'

    const percent = BigNumber(tokenMaxSupply)
      .minus(tokenLeftAmount)
      .div(tokenMaxSupply)
      .multipliedBy(100)

    return percent.lte(0) || percent.isNaN() ? '0' : percent.toFixed(2)
  }, [tokenMaxSupply, tokenLeftAmount, isGraduated])

  const refetchDetails = () => {
    refetchMetadata()
    refetchPools()
  }

  return {
    tokenMetadata,
    isLoadingDetails: isLoadingMetadata,
    totalSupply: tokenMaxSupply,
    refetchDetails,

    progress,
    isGraduated,
    tokenLeftAmount,
    reserveTotalAmount,
  }
}
