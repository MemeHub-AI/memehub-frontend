import { readContract } from 'wagmi/actions'
import { parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { commonAddr } from '@/contract/address'
import { useChainInfo } from '@/hooks/use-chain-info'
import { uniswapV2RouterAbi } from '@/contract/uniswapv2/abi/router'
import { BI_ZERO } from '@/constants/number'

export const useUniswapV2Info = () => {
  const { chainId } = useChainInfo()
  const { router } = commonAddr[chainId as keyof typeof commonAddr] || {}

  const getReserveAmount = async (amountIn: string) => {
    return await readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), parseEther(amountIn), parseEther(amountIn)],
    }).catch((e: Error) => {
      console.error(e.message)
      return BI_ZERO
    })
  }

  const getTokenAmount = async (amountOut: string) => {
    const amount = await readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'getAmountIn',
      args: [
        parseEther(amountOut),
        parseEther(amountOut),
        parseEther(amountOut),
      ],
    }).catch((e: Error) => {
      console.error(e.message)
      return BI_ZERO
    })
    return amount
  }

  return {
    getReserveAmount,
    getTokenAmount,
  }
}
