import React, { type ComponentProps, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, formatEther } from 'viem'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

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

export const TradeTab = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(Tab.Buy))
  const [value, setValue] = useState('0')
  const [isBuy, isSell] = useMemo(
    () => [tab === Tab.Buy, tab === Tab.Sell],
    [tab]
  )
  const { query } = useRouter()
  const tokenAddress = query.address as Address
  const { isConnected } = useAccount()

  const { isTrading, buy, sell, checkTrade } = useTrade()
  const { ethBalance, tokenBalance } = useTradeInfo()
  const { setConnectOpen } = useWalletStore()

  const symbol = 'ETH'

  const onBuy = async () => {
    const { totalAmount, currentAmount } = await checkTrade(tokenAddress)
    const total = formatEther(totalAmount)
    const current = formatEther(currentAmount)

    if (value + current > total) {
      const currentTotal = BigNumber(total).minus(current).toString()
      setValue(currentTotal)
      toast.info(
        t('trade.limit').replace('{}', currentTotal).replace('{}', t('buy'))
      )
      return
    }

    if (BigNumber(value).lt(0)) {
      toast.error(t('trade.is-zero'))
      return
    }

    buy(value, tokenAddress)
  }

  const onSell = async () => {
    if (BigNumber(value).gt(tokenBalance)) {
      toast.error(t('balance.illegality'))
      return
    }

    sell(value, tokenAddress)
  }

  const setPercent = async (value: string) => {
    const percent = BigNumber(value)
      .multipliedBy(tokenBalance)
      .div(100)
      .toString()

    setValue(Number(percent).toFixed(3))
  }

  const onTrade = () => {
    if (!isConnected) {
      setConnectOpen(true)
      return
    }
    isBuy ? onBuy() : onSell()
  }

  return (
    <TradeProvider value={{ isBuy, isSell, symbol, ethBalance, tokenBalance }}>
      <Card className={cn('p-3 grid gap-4 rounded-lg', className)}>
        <Tabs className="w-full" value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 h-11 mb-6">
            <TabsTrigger className="h-full" value={Tab.Buy}>
              {t('buy')}
            </TabsTrigger>
            <TabsTrigger className="h-full" value={Tab.Sell}>
              {t('sell')}
            </TabsTrigger>
          </TabsList>

          {/* Slippage button */}
          <SlippageButton />

          <div className="flex flex-col my-6">
            {/* Input */}
            <TradeInput
              value={value}
              onChange={({ target }) => setValue(target.value)}
            />

            {/* Items button */}
            <TradeItems
              onResetClick={setValue}
              onBuyItemClick={setValue}
              onSellItemClick={setPercent}
            />
          </div>

          {/* Trade button */}
          <Button
            className="w-full"
            onClick={onTrade}
            disabled={isTrading || Number(value) <= 0}
          >
            {t('trade')}
          </Button>
        </Tabs>
      </Card>
    </TradeProvider>
  )
}

export default TradeTab
