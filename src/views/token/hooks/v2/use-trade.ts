import { createElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, formatEther, isAddress } from 'viem'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { useInternelTradeV2 } from './use-internal-trade'
import { useUniswapV2 } from '../use-uniswap-v2'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useTradeInfoV2 } from './use-trade-info'
import { TradeSuccessCard } from '../../components/trade-success-card'

let lastTradeAmount = ''

export const useTradeV2 = () => {
  const { t } = useTranslation()
  const [isListed, setIsListed] = useState(false)
  const { query } = useRouter()
  const token = (query.address ?? '') as Address

  const { tokenDetails, checkForToken, getAmountForBuy } = useTradeInfoV2()
  const {
    internalHash,
    isInternalTrading,
    internalBuy,
    internalSell,
    resetInternalTrade,
  } = useInternelTradeV2()
  const {
    uniswapHash,
    isUniswapTrading,
    uniswapBuy,
    uniswapSell,
    resetUniswapTrade,
  } = useUniswapV2()
  const tradeHash = isListed ? uniswapHash : internalHash
  const isSubmitting = isListed ? isUniswapTrading : isInternalTrading

  const { isLoading, isFetched: isTraded } = useWaitForTx({
    hash: tradeHash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onSuccess: () => {
      toast.dismiss()
      return toast(
        createElement(TradeSuccessCard, {
          amount: lastTradeAmount,
          symbol: tokenDetails?.info.symbol ?? '',
          diamond: '100',
        }),
        { position: 'bottom-left', className: 'w-100' }
      )
    },
    onError: () => toast.error(t('trade.failed')),
    onFillay: () => resetTrade(),
  })
  const isTrading = isSubmitting || isLoading

  const checkForTrade = (amount: string) => {
    if (isEmpty(amount)) {
      toast.error(t('trade.amount.invalid'))
      return false
    }
    if (!isAddress(token)) {
      toast.error(t('trade.token.invalid'))
      return false
    }

    return true
  }

  const buy = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return
    lastTradeAmount = amount

    const [weiNativeAmount] = await getAmountForBuy(token, amount)
    const nativeAmount = BigNumber(formatEther(weiNativeAmount))
    if (nativeAmount.lte(0)) {
      toast.error(t('trade.balance.invalid'))
      return
    }

    const { isOverflow, isListed, currentMax } = await checkForToken(
      token,
      amount
    )
    setIsListed(isListed)

    if (isOverflow && !isListed) return currentMax
    if (isListed) return uniswapBuy(amount, token)

    internalBuy(amount, nativeAmount.toFixed(), token, slippage)
  }

  const sell = async (amount: string) => {
    if (!checkForTrade(amount)) return

    const { isListed } = await checkForToken(token, amount)
    setIsListed(isListed)

    if (isListed) return uniswapSell(amount, token)
    internalSell(amount, token)
  }

  const resetTrade = () => {
    resetInternalTrade()
    resetUniswapTrade()
  }

  return {
    tradeHash,
    isSubmitting,
    isTrading,
    isTraded,
    buy,
    sell,
    resetTrade,
  }
}
