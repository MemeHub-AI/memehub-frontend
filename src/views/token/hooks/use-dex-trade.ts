import { Address } from 'viem'

import { useUniswapV2 } from '@/hooks/uniswapv2/use-uniswapv2'

export const useDexTrade = (
  tokenAddr: Address | undefined | null,
  poolAddr: Address | undefined | null,
  chainId: number
) => {
  const {
    uniswapV2Hash,
    isUniswapV2Trading,
    uniswapV2Buy,
    uniswapV2Sell,
    uniswapV2Reset,
  } = useUniswapV2(tokenAddr, poolAddr, chainId)

  // More DEX here...

  return {
    dexHash: uniswapV2Hash,
    isDexTrading: isUniswapV2Trading,
    dexBuy: uniswapV2Buy,
    dexSell: uniswapV2Sell,
    dexReset: uniswapV2Reset,
  }
}
