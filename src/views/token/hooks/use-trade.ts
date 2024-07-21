import { useEffect, useMemo, useState } from 'react'
import { formatEther } from 'viem'

import { CONTRACT_ERR } from '@/errors/contract'
import { useTradeV3 } from './trade-v3/use-trade'
import { useTokenContext } from '@/contexts/token'
import { useDexTrade } from './trade-dex/use-dex-trade'
import { Options, useTradeToast } from '@/hooks/use-trade-toast'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'
import { useTradeInfoV3 } from './trade-v3/use-trade-info'
import { ContractVersion } from '@/constants/contract'
import { versionOf } from '@/utils/contract'
import { TradeType } from '@/constants/trade'
import { useInvite } from './use-invite'
import { fmt } from '@/utils/fmt'

// Used for trade success tips.
const lastTrade: Options = {
  tokenAmount: '',
  nativeAmount: '',
  type: '',
  txUrl: '',
}

export const useTrade = () => {
  const { tokenInfo } = useTokenContext()
  const { showToast } = useTradeToast()
  const { userInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { getCanBind } = useInvite()
  const [loading, setLoading] = useState(false)

  const dexTrade = useDexTrade()
  const tradeV3 = useTradeV3(dexTrade)
  const { getNativeAmount, getTokenAmount } = useTradeInfoV3()

  const trade = useMemo(() => {
    if (!tokenInfo) return

    const vIs = versionOf(tokenInfo.version)

    if (vIs(ContractVersion.V3)) return tradeV3

    CONTRACT_ERR.versionNotFound()
  }, [tokenInfo?.version, tradeV3])

  const tradeHash = trade?.tradeHash
  const isSubmitting = trade?.isSubmitting
  const isTrading = isSubmitting || loading

  const checkForTrade = async (amount: string) => {
    // Cannot use self code to trade.
    if (userInfo?.code === referralCode) {
      setInviteOpen(true)
      return false
    }

    // Backend check must be `true`.
    const canBind = await getCanBind(referralCode)
    if (!canBind) {
      setInviteOpen(true)
      return false
    }

    return true
  }

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
      const value = await getNativeAmount(amount)
      lastTrade.tokenAmount = fmt.decimals(amount, { fixed: 3 }) + tokenSymbol
      lastTrade.nativeAmount = fmt.decimals(formatEther(value)) + reserveSymbol
    }
  }

  const buying = async (
    amount: string,
    slippage: string,
    setValue?: (value: string) => void,
  ) => {
    setLoading(true)
    const isValid = await checkForTrade(amount)
    if (!isValid) {
      setLoading(false)
      return
    }

    await updateLastTrade(TradeType.Buy, amount)
    console.log('buy', amount, slippage)
    trade?.buy(amount, slippage, setValue)
  }

  const selling = async (amount: string, slippage: string) => {
    setLoading(true)
    const isValid = await checkForTrade(amount)
    if (!isValid) {
      setLoading(false)
      return
    }

    await updateLastTrade(TradeType.Sell, amount)
    console.log('sell', amount, slippage)
    trade?.sell(amount, slippage)
  }

  const resetting = () => {
    trade?.resetTrade()
  }

  useEffect(() => {
    if (!trade?.tradeHash) return
    resetting()
    showToast({
      ...lastTrade,
      txUrl: `${tokenInfo?.chain.explorer}/tx/${trade.tradeHash}`,
      hash: trade.tradeHash,
      setLoading: () => setLoading(false),
    })
  }, [trade])

  return {
    tradeHash,
    isSubmitting,
    isTrading,
    isTraded: false,
    buying,
    selling,
    resetting,
    inviteOpen,
    setInviteOpen,
  }
}
