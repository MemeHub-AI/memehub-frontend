import { useEffect, useState } from 'react'
import { Address, formatEther } from 'viem'

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
import { useChainInfo } from '@/hooks/use-chain-info'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { idoTrumpCard } from '@/config/ido'

// Used for trade success tips.
const lastTrade: Options = {
  tokenAmount: '',
  nativeAmount: '',
  type: '',
  txUrl: '',
}

export const useTrade = () => {
  const { tokenInfo, isIdoToken } = useTokenContext()
  const { showToast } = useTradeToast()
  const { userInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { getCanBind } = useInvite()
  const { chainId } = useChainInfo()

  const dexTrade = useDexTrade(
    chainId,
    (isIdoToken ? idoTrumpCard.poolAddr : tokenInfo?.pool_address) as Address
  )
  const tradeV3 = useTradeV3(dexTrade)
  const { getNativeAmount, getTokenAmount } = useTradeInfoV3()

  const trade = tradeV3
  const tradeHash = trade?.tradeHash
  const isTrading = trade?.isSubmitting
  // This `useWaitForTx` only track status
  const { isFetched: isTraded } = useWaitForTx({ hash: tradeHash })

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

  const buying = async (amount: string, slippage: string) => {
    if (!(await checkForTrade(amount))) {
      return
    }
    if (!isIdoToken) await updateLastTrade(TradeType.Buy, amount)

    return trade?.buy(amount, slippage)
  }

  const selling = async (amount: string, slippage: string) => {
    const isValid = await checkForTrade(amount)
    if (!isValid) {
      return
    }
    if (!isIdoToken) await updateLastTrade(TradeType.Sell, amount)

    return trade?.sell(amount, slippage)
  }

  const resetting = () => {
    trade?.resetTrade()
  }

  // Handle waiting tx with showToast.
  useEffect(() => {
    if (!trade?.tradeHash) return
    resetting()
    showToast({
      ...lastTrade,
      txUrl: `${tokenInfo?.chain.explorer}/tx/${trade.tradeHash}`,
      hash: trade.tradeHash,
    })
  }, [trade])

  return {
    tradeHash,
    isTrading,
    isTraded,
    buying,
    selling,
    resetting,
    inviteOpen,
    setInviteOpen,
  }
}
