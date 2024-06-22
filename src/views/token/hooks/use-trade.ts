import { createElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, formatEther, isAddress } from 'viem'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { TradeSuccessCard } from '../components/trade-success-card'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTradeV1 } from './v1/use-trade'
import { useTradeV2 } from './v2/use-trade'
import { useTradeV3 } from './v3/use-trade'
import { useDexTrade } from './use-dex-trade'

// Used for trade success tips.
let lastTradeAmount = ''

export const useTrade = () => {
  const { t } = useTranslation()
  const [isListed, setIsListed] = useState(false)
  const { query } = useRouter()
  const token = (query.address ?? '') as Address

  const { dexTrade } = useDexTrade()

  const { tradeHashV1, buyV1, sellV1, resetTradeV1 } = useTradeV1(dexTrade)
  const { tradeHashV2, buyV2, sellV2, resetTradeV2 } = useTradeV2(dexTrade)
  const { tradeHashV3, buyV3, sellV3, resetTradeV3 } = useTradeV3(dexTrade)

  const tradeHash = '0x00'
  const isSubmitting = false

  const { isLoading, isFetched: isTraded } = useWaitForTx({
    hash: tradeHash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onSuccess: () => {
      toast.dismiss()
      return toast(
        createElement(TradeSuccessCard, {
          amount: lastTradeAmount,
          symbol: '',
          diamond: '10',
        }),
        { position: 'bottom-left', className: 'w-100' }
      )
    },
    onError: CONTRACT_ERR.tradeFailed,
    onFillay: () => resetTrade(),
  })
  const isTrading = isSubmitting || isLoading

  const checkForTrade = (amount: string) => {
    if (isEmpty(amount)) {
      CONTRACT_ERR.amountInvlid()
      return false
    }
    if (!isAddress(token)) {
      CONTRACT_ERR.tokenInvalid()
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
      CONTRACT_ERR.balanceInvalid()
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

  const sell = async (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return

    const [weiNativeAmount] = await getAmountForSell(token, amount)
    const nativeAmount = BigNumber(formatEther(weiNativeAmount))

    if (nativeAmount.lte(0)) {
      CONTRACT_ERR.balanceInvalid()
      return
    }

    const { isListed } = await checkForToken(token, amount)
    setIsListed(isListed)

    if (isListed) return uniswapSell(amount, token)
    internalSell(amount, nativeAmount.toFixed(), token, slippage)
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
