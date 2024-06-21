import { createElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, formatEther, isAddress } from 'viem'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import type { UserInfoRes } from '@/api/user/types'
import { useInternelTradeV2 } from './use-internal-trade'
import { useUniswapV2 } from '../use-uniswap-v2'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useTradeInfoV2 } from './use-trade-info'
import { TradeSuccessCard } from '../../components/trade-success-card'
import { CONTRACT_ERR } from '@/errors/contract'
import { rewardApi } from '@/api/reward'
import { useStorage } from '@/hooks/use-storage'
import { useUserStore } from '@/stores/use-user-store'

// Used for trade success tips.
let lastTradeAmount = ''

export const useTradeV2 = () => {
  const { t } = useTranslation()
  const [isListed, setIsListed] = useState(false)
  const { query } = useRouter()
  const token = (query.address ?? '') as Address
  const chain = query.chain as string
  const [operation, setOperation] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState<string>('')
  const [rewardCount, setRewardCount] = useState<number>()
  const { getRewardCode } = useStorage()
  const { userInfo, setUserInfo } = useUserStore()
  const { tokenDetails, checkForToken, getAmountForBuy, getAmountForSell } =
    useTradeInfoV2()
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

  const modifyUser = async () => {
    if (getRewardCode()) return
    const { code } = await rewardApi.modifyUser({
      invitationCode: getRewardCode() as string,
    })
    if (code === 200) return
  }

  const diamondAdd = async () => {
    const { data } = await rewardApi.diamondAdd({
      token_address: token,
      base_amount: amount,
      chain,
      operation: operation,
    })
    if (data) {
      setRewardCount(data.reward_amount)
      const newUserInfo = {
        ...userInfo,
        reward_amount: userInfo!.reward_amount + data.reward_amount,
      } as UserInfoRes
      setUserInfo(newUserInfo)
    }
  }

  const { isLoading, isFetched: isTraded } = useWaitForTx({
    hash: tradeHash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onSuccess: () => {
      toast.dismiss()
      modifyUser()
      diamondAdd()
      return toast(
        createElement(TradeSuccessCard, {
          amount: lastTradeAmount,
          symbol: tokenDetails?.info.symbol ?? '',
          diamond: rewardCount?.toString() ?? '',
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
    setAmount(amount)
    setOperation('buy')
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
    setAmount(amount)
    setOperation('sell')
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
