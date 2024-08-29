import { useReadContract } from 'wagmi'
import { Address, formatEther } from 'viem'

import { memexFactoryAbiMap } from '@/contract/abi/memex/factory'
import { useTokenConfig } from '@/hooks/use-token-config'
import { BI_ZERO } from '@/constants/number'
import { memexIdoAbiMap, MemexIdoVersion } from '@/contract/abi/memex/ido'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useIdeaInitialBuy = (
  chain: string | undefined,
  version?: MemexIdoVersion,
  contract?: string
) => {
  const { memexFactoryAddr, memexFactoryVersion } = useTokenConfig(chain)
  const { chainId } = useChainInfo(chain)
  const idoConfig = {
    abi: memexIdoAbiMap[version!],
    address: contract as Address,
    chainId,
  }

  const {
    data: maxBuy = BI_ZERO,
    isLoading: isLoadingMax,
    refetch: refetchInitialMax,
  } = useReadContract({
    abi: memexFactoryAbiMap[memexFactoryVersion!],
    address: memexFactoryAddr!,
    chainId,
    functionName: 'maxBuy',
    query: { enabled: !!memexFactoryAddr && !!memexFactoryVersion },
  })
  const initialBuyMax = formatEther(maxBuy)

  const {
    data: initAmountIn = BI_ZERO,
    isLoading: isLoadingAmount,
    refetch: refetchInitialAmount,
  } = useReadContract({
    ...idoConfig,
    functionName: 'initAmountIn',
    query: { enabled: !!contract && !!version },
  })
  const initialBuyAmount = formatEther(initAmountIn)

  const refetchInitalBuy = () => {
    refetchInitialMax()
    refetchInitialAmount()
  }

  return {
    initialBuyMax,
    initialBuyAmount,
    isRefundingInitial: isLoadingMax || isLoadingAmount,
    refetchInitalBuy,
  }
}
