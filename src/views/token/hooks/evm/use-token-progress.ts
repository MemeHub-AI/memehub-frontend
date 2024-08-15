import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther, zeroAddress } from 'viem'

import { BI_ZERO } from '@/constants/number'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useTokenDetails } from '@/hooks/use-token-details'
import { TokenVersion } from '@/contract/abi/token'

export const useTokenProgress = (
  tokenAddr: string | undefined | null,
  chainId: number,
  version: TokenVersion
) => {
  const { bcVersion, bcAddr } = useTokenDetails(
    tokenAddr || '',
    chainId,
    version
  )
  const bcConfig = {
    abi: bcAbiMap[bcVersion!],
    address: bcAddr!,
    chainId,
  }

  const {
    data: totalSupply,
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
    args: [tokenAddr! as Address],
    query: {
      enabled: !!bcAddr && !!tokenAddr,
    },
  })
  const [, tokenReserve = BI_ZERO, , , , , , headmaster = zeroAddress] = pools
  const isGraduated = headmaster !== zeroAddress

  const total = formatEther(totalSupply || BI_ZERO)
  const current = formatEther(tokenReserve || BI_ZERO)

  const progress = useMemo(() => {
    if (BigNumber(total).isZero()) return '0.00'
    if (isGraduated) return '100.00'
    if (!isGraduated && BigNumber(current).isZero()) return '0.00'

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
