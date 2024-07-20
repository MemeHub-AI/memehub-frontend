import { Address, Hash } from 'viem'

import { useUniswapV2 } from './use-uniswapv2'

export interface DexTradeProps {
  dexHash: Hash | undefined
  isDexTrading: boolean
  dexBuy: (token: Address, amount: string, slippage: string) => void
  dexSell: (token: Address, amount: string, slippage: string) => void
  dexReset: () => void
}

// TODO: Match dex from token's chain.
export const useDexTrade = (
  chainId: number,
  poolAddr: Address | undefined | null,
) => {
  const {
    uniswapV2Hash,
    isUniswapV2Trading,
    uniswapV2Buy,
    uniswapV2Sell,
    uniswapV2Reset,
  } = useUniswapV2(chainId, poolAddr)

  return {
    dexHash: uniswapV2Hash,
    isDexTrading: isUniswapV2Trading,
    dexBuy: uniswapV2Buy,
    dexSell: uniswapV2Sell,
    dexReset: uniswapV2Reset,
  } as DexTradeProps
}
