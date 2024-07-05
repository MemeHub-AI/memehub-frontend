import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTradeV1 } from './trade-v1/use-trade'
import { useTradeV2 } from './trade-v2/use-trade'
import { useTradeV3 } from './trade-v3/use-trade'
import { useTokenContext } from '@/contexts/token'
import { useDexTrade } from './trade-dex/use-dex-trade'
import { Options, useTradeToast } from '@/hooks/use-trade-toast'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'
import { useTradeInfoV3 } from './trade-v3/use-trade-info'
import { ContractVersion } from '@/constants/contract'
import { logger } from '@/utils/log'
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
  const { getInviterInfo, getCanBind } = useInvite()
  const [loading, setLoading] = useState(false)

  const dexTrade = useDexTrade()
  const tradeV1 = useTradeV1(dexTrade)
  const tradeV2 = useTradeV2(dexTrade)
  const tradeV3 = useTradeV3(dexTrade)
  const { getNativeAmount, getTokenAmount } = useTradeInfoV3()

  const trade = useMemo(() => {
    if (!tokenInfo) return

    const vIs = versionOf(tokenInfo.version)

    if (vIs(ContractVersion.V1)) return tradeV1
    if (vIs(ContractVersion.V2)) return tradeV2
    if (vIs(ContractVersion.V3)) return tradeV3

    CONTRACT_ERR.versionNotFound()
  }, [tokenInfo?.version, tradeV1, tradeV2, tradeV3])

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

  const buying = async (
    reserveAmount: string,
    slippage: string,
    setValue?: (value: string) => void
  ) => {
    setLoading(true)
    try {
      const isValid = await checkForTrade(reserveAmount)
      if (!isValid) {
        setLoading(false)
        return
      }
    } catch {
      setLoading(false)
    }

    const amount = await getTokenAmount(reserveAmount)
    lastTrade.tokenAmount = `${fmt.decimals(formatEther(amount))} ${
      tokenInfo?.ticker
    }`
    lastTrade.nativeAmount = `${fmt.decimals(reserveAmount, 3)} ${
      tokenInfo?.chain.native.symbol
    }`
    lastTrade.type = TradeType.Buy

    logger('buy', reserveAmount, slippage)
    trade?.buy(reserveAmount, slippage, setValue)
  }

  const selling = async (tokenAmount: string, slippage: string) => {
    setLoading(true)
    try {
      const isValid = await checkForTrade(tokenAmount)
      if (!isValid) {
        setLoading(false)
        return
      }
    } catch {
      setLoading(false)
    }

    const amount = await getNativeAmount(tokenAmount)
    lastTrade.nativeAmount = `${fmt.decimals(formatEther(amount), 3)} ${
      tokenInfo?.chain.native.symbol
    }`
    lastTrade.tokenAmount = `${fmt.decimals(tokenAmount)} ${tokenInfo?.ticker}`
    lastTrade.type = TradeType.Sell

    logger('sell', tokenAmount, slippage)
    trade?.sell(tokenAmount, slippage)
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
