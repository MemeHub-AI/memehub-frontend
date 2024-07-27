import { readContract } from 'wagmi/actions'
import { Address, parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { uniswapV2RouterAbi } from '@/contract/uniswapv2/abi/router'
import { uniswapV2LPAbi } from '@/contract/uniswapv2/abi/lp'
import { BI_ZERO, BI_ZERO_TUPLE } from '@/constants/number'
import { useChainInfo } from '@/hooks/use-chain-info'
import { uniswapV2Addr } from '@/contract/uniswapv2/address'
import { reportException } from '@/errors'

export const useUniswapV2Amount = (poolAddr?: Address | undefined | null) => {
  const { chainId } = useChainInfo()

  const getReserves = async () => {
    if (!poolAddr) return BI_ZERO_TUPLE

    return readContract(wagmiConfig, {
      abi: uniswapV2LPAbi,
      address: poolAddr!,
      chainId,
      functionName: 'getReserves',
    }).catch(() => BI_ZERO_TUPLE)
  }

  const getAmountForBuy = async (amountIn: string) => {
    const [reserve0, reserve1] = await getReserves()

    return readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: uniswapV2Addr[chainId],
      chainId,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), reserve0, reserve1],
    }).catch((e: Error) => {
      reportException(e)
      return BI_ZERO
    })
  }

  const getAmountForSell = async (amountIn: string) => {
    const [reserve0, reserve1] = await getReserves()

    return readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: uniswapV2Addr[chainId],
      chainId,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), reserve1, reserve0],
    }).catch((e: Error) => {
      reportException(e)
      return BI_ZERO
    })
  }

  return {
    getAmountForBuy,
    getAmountForSell,
  }
}
