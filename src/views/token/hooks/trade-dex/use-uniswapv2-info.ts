import { useReadContract } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { Address, parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { commonAddr } from '@/contract/address'
import { uniswapV2RouterAbi } from '@/contract/uniswapv2/abi/router'
import { uniswapV2LPAbi } from '@/contract/uniswapv2/abi/lp'
import { BI_ZERO } from '@/constants/number'
import { useChainInfo } from '@/hooks/use-chain-info'
import { Tuple } from '@/utils/types'

export const useUniswapV2Info = (poolAddr?: Address | undefined | null) => {
  const { chainId } = useChainInfo()
  const { router } = commonAddr[chainId as keyof typeof commonAddr] || {}

  const { data: reserves = [BI_ZERO, BI_ZERO, 0] as const } = useReadContract({
    abi: uniswapV2LPAbi,
    address: poolAddr!,
    functionName: 'getReserves',
    query: { enabled: !!poolAddr },
  })
  const reservePair = reserves.slice(0, 2) as Tuple<bigint>

  const getAmountOut = (amountIn: string, reverse = false) => {
    const reversed = [...reservePair].reverse() as Tuple<bigint>

    return readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), ...(reverse ? reversed : reservePair)],
    }).catch((e: Error) => {
      console.error(e.message)
      return BI_ZERO
    })
  }

  const getAmountIn = (amountOut: string, reverse = false) => {
    const reversed = [...reservePair].reverse() as Tuple<bigint>

    return readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'getAmountIn',
      args: [parseEther(amountOut), ...(reverse ? reversed : reservePair)],
    }).catch((e: Error) => {
      console.error(e.message)
      return BI_ZERO
    })
  }

  return {
    getAmountOut,
    getAmountIn,
  }
}
