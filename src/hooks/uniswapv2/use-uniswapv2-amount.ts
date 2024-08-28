import { readContract } from 'wagmi/actions'
import { type Address, parseEther } from 'viem'

import { ConfigChainId, wagmiConfig } from '@/config/wagmi'
import { uniswapV2RouterAbi } from '@/contract/abi/uniswapv2/router'
import { uniswapV2LPAbi } from '@/contract/abi/uniswapv2/lp'
import { BI_ZERO, BI_ZERO_TUPLE } from '@/constants/number'
import { reportException } from '@/errors'
import { addrMap } from '@/contract/address'
import { UNISWAP_ERR } from '@/errors/uniswap'

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
    if (!poolAddr) {
      UNISWAP_ERR.message(`Cannot find pool ${poolAddr}`, false)
      return BI_ZERO_TUPLE
    }

    const [reserve0, reserve1] = await readContract(wagmiConfig, {
      abi: uniswapV2LPAbi,
      address: poolAddr as Address,
      chainId: config.chainId,
      functionName: 'getReserves',
    }).catch((e) => {
      reportException(e)
      return BI_ZERO_TUPLE
    })
    const reserves = [Number(reserve0), Number(reserve1)]
    const reserveAmount = BigInt(Math.min(...reserves))
    const tokenAmount = BigInt(Math.max(...reserves))

    return [reserveAmount, tokenAmount]
  }

  const getTokenAmount = async (amountIn: string) => {
    if (!uniswapv2Router) {
      UNISWAP_ERR.message(`Cannot find router ${uniswapv2Router}`, false)
      return BI_ZERO
    }
    const [reserveAmount, tokenAmount] = await getReserves()

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), reserveAmount, tokenAmount],
    }).catch((e: Error) => {
      reportException(e)
      return BI_ZERO
    })
  }

  const getReserveAmount = async (amountIn: string) => {
    if (!uniswapv2Router) {
      UNISWAP_ERR.message(`Cannot find router ${uniswapv2Router}`, false)
      return BI_ZERO
    }
    const [reserveAmount, tokenAmount] = await getReserves()

    return readContract(wagmiConfig, {
      ...config,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), tokenAmount, reserveAmount],
    }).catch((e: Error) => {
      reportException(e)
      return BI_ZERO
    })
  }

  return {
    getTokenAmount,
    getReserveAmount,
    getReserves,
  }
}
