import { useReadContract } from 'wagmi'
import { useRouter } from 'next/router'
import { Address, formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'

import { getBondConfig } from '@/contract/v2/config/bond'
import { useChainInfo } from '@/hooks/use-chain-info'
import { BI_ZERO } from '@/constants/number'

export const useTokenProgressV2 = (
  overrideToken?: string,
  overrideChainId?: number
) => {
  const { query } = useRouter()
  const { chainId } = useChainInfo()
  const [config] = getBondConfig(chainId) || []

  const token = (overrideToken || query.address || '') as Address
  const cId = overrideChainId || chainId

  const {
    data: tokenDetails,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
    refetch: refetchProgress,
  } = useReadContract({
    ...config!,
    functionName: 'getDetail',
    chainId: cId,
    args: [token],
    query: { enabled: !!token && !!config },
  })
  const { reserveBalance, maxSupply } = tokenDetails?.info ?? {}
  const total = formatEther(maxSupply || BI_ZERO)
  const current = formatEther(reserveBalance || BI_ZERO)
  const progress = BigNumber(current).isZero()
    ? BigNumber(BI_ZERO.toString()).toFixed(2)
    : BigNumber(current).div(total).multipliedBy(100).toFixed(2)

  return {
    total,
    current,
    progress,
    isLoadingProgress,
    isFetchingProgress,
    refetchProgress,
  }
}
