import { Address } from 'viem'

import { useUniswapV2 } from '@/hooks/uniswapv2'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'

export const useDexTrade = (
  tokenAddr: Address | undefined | null,
  poolAddr: Address | undefined | null,
  chainId: number,
  {
    onSuccess,
    onFinally,
  }: { onSuccess?: () => void; onFinally?: () => void } = {}
) => {
  const {
    uniswapV2Hash,
    isUniswapV2Submitting,
    uniswapV2Buy,
    uniswapV2Sell,
    uniswapV2Reset,
  } = useUniswapV2(tokenAddr, poolAddr, chainId)

  const { isFetched } = useWaitForTx({
    hash: uniswapV2Hash,
    onSuccess,
    onFinally,
  })

  // More DEX here...

  return {
    dexHash: uniswapV2Hash,
    isDexSubmitting: isUniswapV2Submitting,
    isDexTraded: isFetched,
    dexBuy: uniswapV2Buy,
    dexSell: uniswapV2Sell,
    dexResetTrade: uniswapV2Reset,
  }
}
