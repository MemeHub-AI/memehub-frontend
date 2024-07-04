import { createElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { formatEther } from 'viem'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTradeV1 } from './trade-v1/use-trade'
import { useTradeV2 } from './trade-v2/use-trade'
import { useTradeV3 } from './trade-v3/use-trade'
import { useTokenContext } from '@/contexts/token'
import { useDexTrade } from './trade-dex/use-dex-trade'
import { useToastDiamond } from '@/hooks/use-toast-diamond'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'
import { useTradeInfoV3 } from './trade-v3/use-trade-info'
import { ContractVersion } from '@/constants/contract'
import { logger } from '@/utils/log'
import { versionOf } from '@/utils/contract'
import { TradeType } from '@/constants/trade'
import { useInvite } from './use-invite'
import { buttonLeft } from '@/config/toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { TxLoading } from '@/components/toast/tx-loading'

// Used for trade success tips.
const lastTrade = {
  amount: '',
  type: '',
}

export const useTrade = () => {
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const { toastDiamond, dismissDiamond } = useToastDiamond()
  const { userInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { getInviterInfo, getCanBind } = useInvite()

  const dexTrade = useDexTrade()
  const tradeV1 = useTradeV1(dexTrade)
  const tradeV2 = useTradeV2(dexTrade)
  const tradeV3 = useTradeV3(dexTrade)
  const { getNativeAmount } = useTradeInfoV3()

  // handling version.
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

  const txUrl = `${tokenInfo?.chain.explorer}/tx/${tradeHash}`
  const { isLoading, isFetched: isTraded } = useWaitForTx({
    hash: tradeHash,
    onLoading: () =>
      toast.message(createElement(TxLoading, { txUrl }), buttonLeft),
    onSuccess: () => {
      toastDiamond(lastTrade.amount, lastTrade.type, {
        txUrl,
        isBuy: lastTrade.type === TradeType.Buy,
        tokenAmount: lastTrade.amount,
        nativeTokenAmount: `${lastTrade} ${tokenInfo?.ticker}`,
      })
    },
    onError: CONTRACT_ERR.tradeFailed,
    onFillay: () => {
      toast.dismiss()
      resetting()
    },
  })

  const isTrading = isSubmitting || isLoading

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
    const isValid = await checkForTrade(reserveAmount)
    if (!isValid) return

    lastTrade.amount = reserveAmount
    lastTrade.type = TradeType.Buy

    logger('buy', reserveAmount, slippage)
    trade?.buy(reserveAmount, slippage, setValue)
  }

  const selling = async (tokenAmount: string, slippage: string) => {
    const isValid = await checkForTrade(tokenAmount)
    if (!isValid) return

    getNativeAmount(tokenAmount).then((amount) => {
      lastTrade.amount = formatEther(amount)
      lastTrade.type = TradeType.Sell
    })

    logger('sell', tokenAmount, slippage)
    trade?.sell(tokenAmount, slippage)
  }

  const resetting = () => {
    trade?.resetTrade()
    dismissDiamond()
  }

  return {
    tradeHash,
    isSubmitting,
    isTrading,
    isTraded,
    buying,
    selling,
    resetting,
    inviteOpen,
    setInviteOpen,
  }
}
