import React, { type ComponentProps, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, isAddress } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { isEmpty } from 'lodash'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useTrade } from '../hooks/use-trade'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useTradeInfo } from '../hooks/use-trade-info'
import { SlippageButton } from './slippage-button'
import { TradeProvider } from '@/contexts/trade'
import { TradeItems } from './trade-items'
import { TradeInput } from './trade-input'

enum Tab {
  Buy = 'buy',
  Sell = 'sell',
}

export const TradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(Tab.Buy))
  const [value, setValue] = useState('0')
  const [isBuy, isSell] = useMemo(
    () => [tab === Tab.Buy, tab === Tab.Sell],
    [tab]
  )
  const { query } = useRouter()

  const { isConnected } = useAccount()
  const { isTrading, buy, sell } = useTrade()
  const { ethBalance, tokenBalance } = useTradeInfo()
  const { setConnectOpen } = useWalletStore()

  const token = (query.address || '') as Address
  const nativeSymbol = 'ETH'

  const onBuy = async () => {
    // Overflow current eth balance.
    if (BigNumber(value).gt(ethBalance)) {
      toast.error(t('balance.illegality'))
      setValue(ethBalance)
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

  const onTrade = () => {
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

    isBuy ? onBuy() : onSell()
  }

  return (
    <TradeProvider
      value={{ isBuy, isSell, nativeSymbol, ethBalance, tokenBalance }}
    >
      <Card className={cn('p-3 grid gap-4 rounded-lg', className)}>
        <Tabs className="w-full" value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 h-11 mb-6">
            <TabsTrigger
              className="h-full"
              value={Tab.Buy}
              disabled={isTrading}
            >
              {t('buy')}
            </TabsTrigger>
            <TabsTrigger
              className="h-full"
              value={Tab.Sell}
              disabled={isTrading}
            >
              {t('sell')}
            </TabsTrigger>
          </TabsList>

          {/* Slippage button */}
          <SlippageButton disabled={isTrading} />

          <div className="flex flex-col my-6">
            {/* Input */}
            <TradeInput
              value={value}
              onChange={({ target }) => setValue(target.value)}
              disabled={isTrading}
            />

            {/* Items button */}
            <TradeItems
              disabled={isTrading}
              onResetClick={setValue}
              onBuyItemClick={(value) => {
                setValue(BigNumber(value).gt(ethBalance) ? ethBalance : value)
              }}
              onSellItemClick={(value: string) => {
                const percent = BigNumber(value)
                  .multipliedBy(tokenBalance)
                  .div(100)
                setValue(percent.toFixed(3))
              }}
            />
          </div>

          {/* Trade button */}
          <Button
            className="w-full"
            onClick={onTrade}
            disabled={isTrading || BigNumber(value).lte(0)}
          >
            {isTrading ? t('trading') : t('trade')}
          </Button>
        </Tabs>
      </Card>
    </TradeProvider>
  )
}

export default TradeTab
