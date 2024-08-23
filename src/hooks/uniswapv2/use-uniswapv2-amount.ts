import { readContract } from 'wagmi/actions'
import { Address, parseEther } from 'viem'

import { ConfigChainId, wagmiConfig } from '@/config/wagmi'
import { uniswapV2RouterAbi } from '@/contract/abi/uniswapv2/router'
import { uniswapV2LPAbi } from '@/contract/abi/uniswapv2/lp'
import { BI_ZERO, BI_ZERO_TUPLE } from '@/constants/number'
import { reportException } from '@/errors'
import { addrMap } from '@/contract/address'

export const useUniswapV2Amount = (
  chainId: number,
  poolAddr?: string | undefined | null
) => {
  const { uniswapv2Router } = addrMap[chainId] ?? {}
  const config = {
    abi: uniswapV2RouterAbi,
    address: uniswapv2Router!,
    chainId: chainId as ConfigChainId,
  }

  const getReserves = async () => {
    if (!poolAddr) return BI_ZERO_TUPLE

    return readContract(wagmiConfig, {
      abi: uniswapV2LPAbi,
      address: poolAddr as Address,
      chainId: config.chainId,
      functionName: 'getReserves',
    }).catch((e) => {
      reportException(e)
      return BI_ZERO_TUPLE
    })
  }

  const getTokenAmount = async (amountIn: string) => {
    if (!uniswapv2Router) return BI_ZERO
    const [reserve0, reserve1] = await getReserves()

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), reserve0, reserve1],
    }).catch((e: Error) => {
      reportException(e)
      return BI_ZERO
    })
  }

  const getReserveAmount = async (amountIn: string) => {
    if (!uniswapv2Router) return BI_ZERO
    const [reserve0, reserve1] = await getReserves()

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), reserve1, reserve0],
    }).catch((e: Error) => {
      reportException(e)
      return BI_ZERO
    })
  }

  return {
    getTokenAmount,
    getReserveAmount,
  }
}
