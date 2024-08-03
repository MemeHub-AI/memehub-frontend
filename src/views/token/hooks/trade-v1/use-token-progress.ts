import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther } from 'viem'

import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { BI_ZERO } from '@/constants/number'
import { usePools } from '../use-pools'
import { addrMap } from '@/contract/address'
import { bondingCurveAbiMap } from '@/contract/abi/bonding-curve'

export const useTokenProgressV1 = (
  overrideToken?: Address,
  overrideChainId?: number
) => {
  const { tokenAddr } = useTradeSearchParams()
  const { chainId: cId } = useChainInfo()

  const token = overrideToken ?? tokenAddr
  const chainId = overrideChainId ?? cId
  const { bondingCurve } = addrMap[chainId] ?? {}

  const {
    data: totalSupply,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
    refetch: refetchTotal,
  } = useReadContract({
    abi: bondingCurveAbiMap['0.1.0'], // TODO: match version
    address: bondingCurve!,
    functionName: 'maxSupply_',
    chainId,
    query: { enabled: !!bondingCurve },
  })
  const { tokenReserve, isGraduated, refetchPools } = usePools(token, chainId)

  const total = formatEther(totalSupply || BI_ZERO)
  const current = formatEther(tokenReserve || BI_ZERO)

  const progress = useMemo(() => {
    if (BigNumber(total).isZero()) return '0.00'
    if (isGraduated) return '100.00'
    if (!isGraduated && BigNumber(current).isZero()) return '0.00'

    // Calc progress.
    return BigNumber(total)
      .minus(current)
      .div(total)
      .multipliedBy(100)
      .toFixed(2)
  }, [total, current, isGraduated])

  const refetchProgress = () => {
    refetchTotal()
    refetchPools()
  }

  return {
    total,
    current,
    progress,
    isLoadingProgress,
    isFetchingProgress,
    isGrauated: isGraduated,
    refetchProgress,
  }
}
