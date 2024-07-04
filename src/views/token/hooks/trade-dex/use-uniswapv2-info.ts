import { readContract } from 'wagmi/actions'
import { parseEther } from 'viem'

import { wagmiConfig } from '@/config/wagmi'
import { uniswapV2Config } from '@/contract/abi/uniswap-v2'
import { commonAddr } from '@/contract/address'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useTradeSearchParams } from '../use-search-params'
import { BI_ZERO_TUPLE } from '@/constants/contract'

export const useUniswapV2Info = () => {
  const { chainId } = useChainInfo()
  const { router, reserveToken } =
    commonAddr[chainId as keyof typeof commonAddr] || {}
  const { tokenAddr } = useTradeSearchParams()

  const getReserveAmount = async (amountIn: string) => {
    const [amount] = await readContract(wagmiConfig, {
      ...uniswapV2Config,
      address: router,
      chainId,
      functionName: 'getAmountsIn',
      args: [parseEther(amountIn), [reserveToken, tokenAddr]],
    }).catch(() => BI_ZERO_TUPLE)
    return amount
  }

  const getTokenAmount = async (amountOut: string) => {
    const [amount] = await readContract(wagmiConfig, {
      ...uniswapV2Config,
      address: router,
      chainId,
      functionName: 'getAmountsIn',
      args: [parseEther(amountOut), [tokenAddr, reserveToken]],
    }).catch(() => BI_ZERO_TUPLE)
    return amount
  }

  return {
    getReserveAmount,
    getTokenAmount,
  }
}
