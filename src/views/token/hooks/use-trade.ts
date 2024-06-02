import { useState } from 'react'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { Address } from 'viem'

import { useInternalTrade } from './use-internal-trade'
import { useUniswapV2 } from './use-uniswap-v2'
import { useTradeInfo } from './use-trade-info'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useTokenContext } from '@/contexts/token'

export const useTrade = () => {
  const { t } = useTranslation()
  const [isInternalTrade, setIsInternalTrade] = useState(true)
  const { query } = useRouter()
  const token = (query.address || '') as Address
  const { refetchInfo } = useTokenContext()

  const { checkForOverflow } = useTradeInfo()
  const {
    internalHash,
    isInternalTrading,
    internalBuy,
    internalSell,
    resetInternalTrade,
  } = useInternalTrade()
  const {
    uniswapHash,
    isUniswapTrading,
    uniswapBuy,
    uniswapSell,
    resetUniswapTrade,
  } = useUniswapV2()
  const hash = isInternalTrade ? internalHash : uniswapHash
  const isSubmitting = isInternalTrading || isUniswapTrading

  // Waiting results for contract interaction.
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onSuccess: () => toast.success(t('trade.success')),
    onError: () => toast.error(t('trade.failed')),
    onFillay: () => {
      resetTrade()
      refetchInfo()
      toast.dismiss()
    },
  })
  const isTrading = isInternalTrading || isUniswapTrading || isLoading

  // Check trade type. internal trade or dex trade.
  const checkForTrade = async (amount: string) => {
    const { currentMax, isOverflow } = await checkForOverflow(amount)
    const isInternal = !BigNumber(currentMax).eq(0)

    return {
      isInternal,
      isOverflow,
      currentMax,
    }
  }

  const buy = async (amount: string) => {
    const { currentMax, isInternal, isOverflow } = await checkForTrade(amount)

    setIsInternalTrade(isInternal)

    // Internal buy but overflow current max value.
    if (isInternal && isOverflow) return currentMax

    // Internal buy.
    if (isInternal) return internalBuy(amount, token)

    // DEX buy.
    uniswapBuy(amount, token)
  }

  const sell = async (amount: string) => {
    const { isInternal } = await checkForTrade(amount)

    setIsInternalTrade(isInternal)

    // Internal sell.
    if (isInternal) return internalSell(amount, token)

    // DEX sell.
    uniswapSell(amount, token)
  }

  const resetTrade = () => {
    resetInternalTrade()
    resetUniswapTrade()
  }

  return {
    tradeHash: hash,
    isSubmitting,
    isTrading,
    checkForTrade,
    buy,
    sell,
    resetTrade,
  }
}
