import React, { type ComponentProps, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, isAddress } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount, useSwitchChain } from 'wagmi'
import { isEmpty } from 'lodash'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useTradeV1 } from '../hooks/v1/use-trade'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useTradeInfoV1 } from '../hooks/v1/use-trade-info'
import { SlippageButton } from './slippage-button'
import { TradeProvider } from '@/contexts/trade'
import { TradeItems } from './trade-items'
import { TradeInput } from './trade-input'
import { TradeType } from '@/api/websocket/types'
import { useTokenContext } from '@/contexts/token'
import { useTradeInfoV2 } from '../hooks/v2/use-trade-info'
import { useTradeV2 } from '../hooks/v2/use-trade'

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(TradeType.Buy))
  const [value, setValue] = useState('0')
  const [isBuy, isSell] = useMemo(
    () => [tab === TradeType.Buy, tab === TradeType.Sell],
    [tab]
  )
  const { query } = useRouter()

  const { switchChainAsync } = useSwitchChain()
  const { isConnected, chainId } = useAccount()
  const { isSubmitting, isTraded, buy, sell } = useTradeV1()
  const {
    nativeBalance,
    tokenBalance,
    refetchNativeBalance,
    refetchTokenBalance,
  } = useTradeInfoV1()
  const { buy: buyV2, sell: sellV2 } = useTradeV2()
  const {} = useTradeInfoV2()
  const { setConnectOpen } = useWalletStore()
  const { tokenInfo } = useTokenContext()

  const token = (query.address || '') as Address
  const nativeSymbol = tokenInfo?.chain.native.symbol || ''

  const onBuy = async () => {
    // Overflow current wallet balance.
    if (BigNumber(value).gt(nativeBalance)) {
      toast.error(t('balance.illegality'))
      setValue(nativeBalance)
      return
    }
    const max = await buy(value)

    // Internal buy & overflow current max value.
    if (max) {
      setValue(max)
      toast.error(t('trade.limit').replace('{}', max).replace('{}', t('buy')))
      return
    }
  }

  const onSell = async () => {
    // Overflow current token balance.
    if (BigNumber(value).gt(tokenBalance)) {
      toast.error(t('balance.illegality'))
      return
    }

    sell(value)
  }

  const checkForChain = async () => {
    if (!chainId || !tokenInfo?.chain.id) return false

    const tokenChainId = Number(tokenInfo?.chain.id)
    if (chainId === tokenChainId) return true

    try {
      await switchChainAsync({ chainId: tokenChainId })
      return true
    } catch (error) {
      toast.error(t('chain-error'))
      return false
    }
  }

  const onTrade = async () => {
    isBuy ? buyV2(value) : sellV2(value)
    return
    // Wallet is not connect.
    if (!isConnected) {
      setConnectOpen(true)
      return
    }

    // Token address is invalid.
    if (isEmpty(token) || !isAddress(token)) {
      toast.error(t('trade.token.invalid'))
      return
    }

    // Chain is not correct.
    const isValidChain = await checkForChain()
    if (!isValidChain) return

    isBuy ? onBuy() : onSell()
  }

  // Refresh balance when trade completed.
  useEffect(() => {
    if (!isTraded) return

    setValue('0')
    refetchNativeBalance()
    refetchTokenBalance()
  }, [isTraded])

  return (
    <TradeProvider
      value={{
        isBuy,
        isSell,
        isTraded,
        nativeSymbol,
        nativeBalance,
        tokenBalance,
      }}
    >
      <Card
        hover="none"
        shadow="none"
        className={cn('p-3 grid gap-4 rounded-lg', className)}
      >
        <Tabs className="w-full" value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 h-11 mb-6">
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Buy}
              disabled={isSubmitting}
            >
              {t('trade.buy')}
            </TabsTrigger>
            <TabsTrigger
              className="h-full font-bold"
              value={TradeType.Sell}
              disabled={isSubmitting}
            >
              {t('trade.sell')}
            </TabsTrigger>
          </TabsList>

          {/* Slippage button */}
          {/* <SlippageButton disabled={isTrading} /> */}

          <div className="flex flex-col my-6">
            {/* Input */}
            <TradeInput
              value={value}
              onChange={setValue}
              disabled={isSubmitting}
            />

            {/* Items button */}
            <TradeItems
              disabled={isSubmitting}
              onResetClick={setValue}
              onBuyItemClick={(value) => {
                if (BigNumber(nativeBalance).lte(0)) {
                  toast.warning(t('trade.balance.zero'))
                  return
                }
                if (BigNumber(value).gt(nativeBalance)) {
                  setValue(nativeBalance)
                  return
                }
                setValue(value)
              }}
              onSellItemClick={(value: string) => {
                if (BigNumber(tokenBalance).lte(0)) {
                  toast.warning(t('trade.balance.zero'))
                  return
                }
                const percent = BigNumber(value)
                  .multipliedBy(tokenBalance)
                  .div(100)
                setValue(percent.toFixed())
              }}
            />
          </div>

          {/* Trade button */}
          <Button
            className="!w-full font-bold"
            onClick={onTrade}
            disabled={isSubmitting || !value || BigNumber(value).lte(0)}
          >
            {isSubmitting ? t('trading') : t('trade')}
          </Button>
        </Tabs>
      </Card>
    </TradeProvider>
  )
}

export default TradeTab
