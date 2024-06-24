import { useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther } from 'viem'

import { getV3Config } from '@/contract/v3/config'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { BI_ZERO } from '@/constants/contract'

export const useTokenProgressV3 = (
  overrideToken?: Address,
  overrideChainId?: number
) => {
  const { tokenAddr } = useTradeSearchParams()
  const { chainId: cId } = useChainInfo()

  const token = overrideToken ?? tokenAddr
  const chainId = overrideChainId ?? cId
  const config = getV3Config(chainId)

  const {
    data: totalSupply,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
    refetch: refetchProgress,
  } = useReadContract({
    ...config.bondingCurveConfig!,
    functionName: 'maxSupply_',
    chainId,
    query: { enabled: !!config },
  })

  const { data: details = [] } = useReadContract({
    ...config.bondingCurveConfig!,
    functionName: 'pools_',
    chainId,
    args: [token],
    query: { enabled: !!config?.bondingCurveConfig },
  })
  const [
    ,
    tokenReserve,
    vTokenReserve,
    ethReserve,
    vEthReserve,
    addPoolEthAmount,
    creator,
    headmaster,
  ] = details

  const total = formatEther(totalSupply || BI_ZERO)
  const current = formatEther(tokenReserve || BI_ZERO)
  const progress =
    BigNumber(total).isZero() || BigNumber(current).isZero()
      ? BigNumber(BI_ZERO.toString()).toFixed(2)
      : BigNumber(total).minus(current).div(total).multipliedBy(100).toFixed(2)

  return {
    total,
    current,
    progress,
    isLoadingProgress,
    isFetchingProgress,
    refetchProgress,
  }
}
