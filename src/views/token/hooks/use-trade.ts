import { useMemo, useState } from 'react'
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
  const { getTokenAmount } = useTradeInfoV3()

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

  const { isLoading, isFetched: isTraded } = useWaitForTx({
    hash: tradeHash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onSuccess: () => {
      toastDiamond(lastTrade.amount, lastTrade.type)
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
    amount: string,
    slippage: string,
    setValue?: (value: string) => void
  ) => {
    const isValid = await checkForTrade(amount)
    if (!isValid) return

    // TODO: temp
    getTokenAmount(amount).then((data) => {
      lastTrade.amount = formatEther(data)
      lastTrade.type = TradeType.Buy
    })

    logger('buy', amount, slippage)
    trade?.buy(amount, slippage, setValue)
  }

  const selling = async (amount: string, slippage: string) => {
    const isValid = await checkForTrade(amount)
    if (!isValid) return
    lastTrade.amount = amount
    lastTrade.type = TradeType.Sell

    logger('sell', amount, slippage)
    trade?.sell(amount, slippage)
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
