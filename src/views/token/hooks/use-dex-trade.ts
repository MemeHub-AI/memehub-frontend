import { Hash } from 'viem'

import { useUniswapV2 } from './use-uniswap-v2'

export interface DexTradeProps {
  dexHash: Hash | undefined
  isDexTrading: boolean
  dexBuy: (...args: any[]) => void
  dexSell: (...args: any[]) => void
  dexReset: () => void
}

export const useDexTrade = () => {
  const uniswapV2Trade = useUniswapV2()

  return {
    dexTrade: uniswapV2Trade,
  }
}
