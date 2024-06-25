import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTradeV1 } from './trade-v1/use-trade'
import { useTradeV2 } from './trade-v2/use-trade'
import { useTradeV3 } from './trade-v3/use-trade'
import { useTokenContext } from '@/contexts/token'
import { ContractVersion } from '@/enum/contract'
import { useDexTrade } from './trade-dex/use-dex-trade'
import { useToastDiamond } from '@/hooks/use-toast-diamond'
import { useInvite } from './trade-v3/use-invite'
import { useUserInfo } from '@/hooks/use-user-info'
import { useTradeSearchParams } from './use-search-params'

// Used for trade success tips.
let lastTradeAmount = ''

export const useTrade = () => {
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const { toastDiamond, dismissDiamond } = useToastDiamond()
  const { bindInviter } = useInvite()
  const { userInfo, refetchUserInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()
  const [inviteSelfOpen, setInviteSelfOpen] = useState(false)

  const dexTrade = useDexTrade()
  const tradeV1 = useTradeV1(dexTrade)
  const tradeV2 = useTradeV2(dexTrade)
  const tradeV3 = useTradeV3(dexTrade)

  // handling version.
  const trade = useMemo(() => {
    if (!tokenInfo) return

    switch (tokenInfo?.version) {
      case ContractVersion.V1:
        return tradeV1
      case ContractVersion.V2:
        return tradeV2
      case ContractVersion.V3:
        return tradeV3
      default:
        CONTRACT_ERR.versionNotFound()
        return
    }
  }, [tokenInfo?.version, tradeV1, tradeV2, tradeV3])

  const tradeHash = trade?.tradeHash
  const isSubmitting = trade?.isSubmitting

  const { isLoading, isFetched: isTraded } = useWaitForTx({
    hash: tradeHash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onSuccess: () => {
      toastDiamond(lastTradeAmount)
      bindInviter()
    },
    onError: CONTRACT_ERR.tradeFailed,
    onFillay: () => {
      toast.dismiss()
      resetting()
      refetchUserInfo()
    },
  })
  const isTrading = isSubmitting || isLoading

  const checkForTrade = (amount: string) => {
    if (userInfo?.code === referralCode) {
      setInviteSelfOpen(true)
      return false
    }
    return true
  }

  const buying = (
    amount: string,
    slippage: string,
    setValue?: (value: string) => void
  ) => {
    if (!checkForTrade(amount)) return
    lastTradeAmount = amount

    console.log('trade', amount, slippage)
    trade?.buy(amount, slippage, setValue)
  }

  const selling = (amount: string, slippage: string) => {
    if (!checkForTrade(amount)) return
    lastTradeAmount = amount

    console.log('sell', amount, slippage)
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
    inviteSelfOpen,
    setInviteSelfOpen,
  }
}
