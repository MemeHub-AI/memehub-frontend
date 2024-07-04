import { Hash } from 'viem'

import { useUniswapV2 } from './use-uniswapv2'

export interface DexTradeProps {
  dexHash: Hash | undefined
  isDexTrading: boolean
  dexBuy: (...args: any[]) => void
  dexSell: (...args: any[]) => void
  dexReset: () => void
}

// TODO: Match dex from token's chain.
export const useDexTrade = () => {
  const {
    uniswapV2Hash,
    isUniswapV2Trading,
    uniswapV2Buy,
    uniswapV2Sell,
    uniswapV2Reset,
  } = useUniswapV2()

  return {
    dexHash: uniswapV2Hash,
    isDexTrading: isUniswapV2Trading,
    dexBuy: uniswapV2Buy,
    dexSell: uniswapV2Sell,
    dexReset: uniswapV2Reset,
  } as DexTradeProps
}
