import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
import { idoAbi } from '@/contract/abi/ido/ido'
import { addrMap } from '@/contract/address'

export const useIdoProgress = (chainId: number, poolId: number) => {
  const { ido } = addrMap[chainId] ?? {}

  const {
    data: pools = [],
    isLoading: isLoadingProgress,
    refetch: refetchProgress,
  } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'pools',
    args: [BigInt(poolId)],
    query: { enabled: !!ido, refetchInterval: 5_000 },
  })
  const [, , , , , , , totalEthAmount = BI_ZERO, , raisedEthAmount = BI_ZERO] =
    pools
  const totalReserveAmount = formatEther(totalEthAmount)
  const raisedReserveAmount = formatEther(raisedEthAmount)

  const progress = useMemo(() => {
    const p = BigNumber(raisedReserveAmount)
      .div(totalReserveAmount)
      .multipliedBy(100)
    return p.isNaN() ? 0 : p.toFixed(2)
  }, [pools])

  return {
    progress,
    isLoadingProgress,
    refetchProgress,
  }
}
