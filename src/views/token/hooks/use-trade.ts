import { useEffect, useState } from 'react'
import { Address, formatEther } from 'viem'

import { useTradeV3 } from './trade-v1/use-trade'
import { useTokenContext } from '@/contexts/token'
import { Options, useTradeToast } from '@/hooks/use-trade-toast'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'
import { TradeType } from '@/constants/trade'
import { useInvite } from './use-invite'
import { fmt } from '@/utils/fmt'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useDexTrade } from './use-dex-trade'
import { idoTrumpCard } from '@/config/ido'

// Used for trade success tips.
const lastTrade: Options = {
  tokenAmount: '',
  nativeAmount: '',
  type: '',
  txUrl: '',
}

export const useTrade = (onSuccess?: () => void) => {
  const { tokenInfo, isIdoToken, isGraduated } = useTokenContext()
  const { address, pool_address, chain } = tokenInfo ?? {}
  const { showToast } = useTradeToast()
  const { userInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteErrorOpen, setInviteErrorOpen] = useState(false)
  const { getCanBind } = useInvite()

  const { dexHash, isDexTrading, dexBuy, dexSell } = useDexTrade(
    address as Address,
    (isIdoToken ? idoTrumpCard.poolAddr : pool_address) as Address,
    Number(chain?.id)
  )
  const {
    hashV3,
    isSubmittingV3,
    buyV3,
    sellV3,
    resetTradeV3,
    getReserveAmountV3,
    getTokenAmountV3,
  } = useTradeV3()
  // const { hashV2 } = useTradeV2() // More version example
  const hash = dexHash || hashV3
  const isTrading = isDexTrading || isSubmittingV3
  const getReserveAmount = getReserveAmountV3
  const getTokenAmount = getTokenAmountV3

  // This `useWaitForTx` only track status.
  const { isFetched: isTraded } = useWaitForTx({
    hash,
    onSuccess,
    onFillay: () => resetTrade(),
  })

  const updateLastTrade = async (type: TradeType, amount: string) => {
    const tokenSymbol = tokenInfo?.ticker
    const reserveSymbol = tokenInfo?.chain.native.symbol
    lastTrade.type = type

    if (type === TradeType.Buy) {
      const value = await getTokenAmount(amount)
      lastTrade.tokenAmount = fmt.decimals(formatEther(value)) + tokenSymbol
      lastTrade.nativeAmount =
        fmt.decimals(amount, { fixed: 3 }) + reserveSymbol
    } else {
      const value = await getReserveAmount(amount)
      lastTrade.tokenAmount = fmt.decimals(amount, { fixed: 3 }) + tokenSymbol
      lastTrade.nativeAmount = fmt.decimals(formatEther(value)) + reserveSymbol
    }
  }

  const checkForTrade = async () => {
    // Cannot use self code to trade.
    if (userInfo?.code === referralCode) {
      setInviteErrorOpen(true)
      return false
    }
    // Backend check.
    if (!(await getCanBind(referralCode))) {
      setInviteErrorOpen(true)
      return false
    }

    return true
  }

  const buy = async (amount: string, slippage: string) => {
    if (!(await checkForTrade())) return
    // DEX trade, ido token with trade tax
    if (isGraduated || isIdoToken) {
      return dexBuy(amount, slippage, isIdoToken)
    }

    await updateLastTrade(TradeType.Buy, amount)
    return buyV3(amount, slippage)
  }

  const sell = async (amount: string, slippage: string) => {
    if (!(await checkForTrade())) return
    // DEX trade, ido token with trade tax
    if (isGraduated || isIdoToken) {
      return dexSell(amount, slippage, isIdoToken)
    }

    await updateLastTrade(TradeType.Sell, amount)
    return sellV3(amount, slippage)
  }

  const resetTrade = () => {
    resetTradeV3()
    // More versions...
  }

  // Handle waiting tx with showToast.
  useEffect(() => {
    if (!hash) return
    resetTrade()
    showToast({
      ...lastTrade,
      txUrl: `${tokenInfo?.chain.explorer}/tx/${hash}`,
      hash: hash,
    })
  }, [hash])

  return {
    hash,
    isTrading,
    isTraded,
    buy,
    sell,
    inviteErrorOpen,
    setInviteErrorOpen,
  }
}
