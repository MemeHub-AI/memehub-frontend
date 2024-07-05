import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther } from 'viem'

import { getV3Config } from '@/contract/v3/config'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { BI_ZERO } from '@/constants/number'
import { usePools } from '../use-pools'

export const useTokenProgressV3 = (
  overrideToken?: Address,
  overrideChainId?: number
) => {
  const { tokenAddr } = useTradeSearchParams()
  const { chainId: cId } = useChainInfo()

  const token = overrideToken ?? tokenAddr
  const chainId = overrideChainId ?? cId
  const { bondingCurveConfig } = getV3Config(chainId)

  const {
    data: totalSupply,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
    refetch: refetchTotal,
  } = useReadContract({
    ...bondingCurveConfig!,
    chainId,
    functionName: 'maxSupply_',
    query: { enabled: !!bondingCurveConfig },
  })
  const { tokenReserve, isGrauated, refetchPools } = usePools(token, chainId)

  const total = formatEther(totalSupply || BI_ZERO)
  const current = formatEther(tokenReserve || BI_ZERO)

  const progress = useMemo(() => {
    if (BigNumber(total).isZero()) return '0.00'
    if (isGrauated) return '100.00'
    if (!isGrauated && BigNumber(current).isZero()) return '0.00'

    // Calc progress.
    return BigNumber(total)
      .minus(current)
      .div(total)
      .multipliedBy(100)
      .toFixed(2)
  }, [total, current, isGrauated])

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
    isGrauated,
    refetchProgress,
  }
}
