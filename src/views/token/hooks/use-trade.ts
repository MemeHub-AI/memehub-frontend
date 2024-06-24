import { createElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { TradeSuccessCard } from '../components/trade-success-card'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTradeV1 } from './trade-v1/use-trade'
import { useTradeV2 } from './trade-v2/use-trade'
import { useTradeV3 } from './trade-v3/use-trade'
import { useTokenContext } from '@/contexts/token'
import { ContractVersion } from '@/enum/contract'
import { useDexTrade } from './trade-dex/use-dex-trade'

// Used for trade success tips.
let lastTradeAmount = ''

export const useTrade = () => {
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()

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
    onFillay: () => resetting(),
  })
  const isTrading = isSubmitting || isLoading

  const buying = (
    amount: string,
    slippage: string,
    setValue?: (value: string) => void
  ) => {
    trade?.buy(amount, slippage, setValue)
  }

  const selling = (amount: string, slippage: string) => {
    trade?.sell(amount, slippage)
  }

  const resetting = () => {
    trade?.resetTrade()
  }

  return {
    tradeHash,
    isSubmitting,
    isTrading,
    isTraded,
    buying,
    selling,
    resetting,
  }
}
