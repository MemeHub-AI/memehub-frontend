import { useReadContract } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { Address, parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { commonAddr } from '@/contract/address'
import { uniswapV2RouterAbi } from '@/contract/uniswapv2/abi/router'
import { uniswapV2LPAbi } from '@/contract/uniswapv2/abi/lp'
import { BI_ZERO } from '@/constants/number'
import { useChainInfo } from '@/hooks/use-chain-info'

export const useUniswapV2Info = (poolAddr?: Address | undefined) => {
  const { chainId } = useChainInfo()
  const { router } = commonAddr[chainId as keyof typeof commonAddr] || {}

  const { data: reserves = [BI_ZERO, BI_ZERO, 0] as const } = useReadContract({
    abi: uniswapV2LPAbi,
    address: poolAddr,
    functionName: 'getReserves',
    query: { enabled: !!poolAddr },
  })
  const [reserveIn, reserveOut] = reserves

  const getReserveAmount = (amountOut: string) => {
    return readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'getAmountIn',
      args: [parseEther(amountOut), reserveIn, reserveOut],
    }).catch((e: Error) => {
      console.error(e.message)
      return BI_ZERO
    })
  }

  const getTokenAmount = (amountIn: string) => {
    return readContract(wagmiConfig, {
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), reserveIn, reserveOut],
    }).catch((e: Error) => {
      console.error(e.message)
      return BI_ZERO
    })
  }

  return {
    getReserveAmount,
    getTokenAmount,
  }
}
