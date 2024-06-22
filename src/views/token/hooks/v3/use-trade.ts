import { DexTradeProps } from '../use-trade'

export const useTradeV3 = (dexProps: DexTradeProps) => {
  const { dexHash, dexBuy, dexSell, dexReset } = dexProps

  const tradeHashV3 = dexHash

  const isSubmittingV3 = false

  const buyV3 = () => {}

  const sellV3 = () => {}

  const resetTradeV3 = () => {
    dexReset()
  }

  return {
    tradeHashV3,
    isSubmittingV3,
    buyV3,
    sellV3,
    resetTradeV3,
  }
}
