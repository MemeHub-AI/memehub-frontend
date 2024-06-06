import { useRouter } from 'next/router'
import { useReadContracts } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'

import { v1ContinousTokenAbi } from '@/contract/v1/abi/continous-token'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useTokenProgress = (
  overrideAddr?: Address,
  overrideChainId?: number
) => {
  const { query } = useRouter()
  const { chainId: currentChainId } = useChainInfo()

  const tokenAddr = (query.address || '') as Address
  const address = overrideAddr || tokenAddr
  const chainId = overrideChainId || currentChainId

  const {
    data = [],
    refetch: refetchProgress,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
  } = useReadContracts({
    contracts: [
      {
        abi: v1ContinousTokenAbi,
        address,
        chainId,
        functionName: 'ETH_AMOUNT',
      },
      {
        abi: v1ContinousTokenAbi,
        address,
        chainId,
        functionName: 'raiseEthAmount',
      },
    ],
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
    },
  })
  const total = formatEther(data[0]?.result || BigInt(0))
  const current = formatEther(data[1]?.result || BigInt(0))
  const progress = BigNumber(current).div(total).multipliedBy(100).toFixed(2)

  return {
    total,
    current,
    progress,
    isLoadingProgress,
    isFetchingProgress,
    refetchProgress,
  }
}
