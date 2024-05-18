import React, { type ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useTrade } from '../hooks/use-trade'

enum Tab {
  Buy = 'buy',
  Sell = 'sell',
}

const buyItems = [0.1, 1, 2, 5]
const sellItems = [10, 25, 75, 100]

export const TradeTab = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(Tab.Buy))
  const [value, setValue] = useState(0)
  const [slippage, setSlippage] = useState(10)
  const { isTrading, buy, sell, checkTrade } = useTrade()

  const isBuy = tab === Tab.Buy
  const isSell = tab === Tab.Sell
  const symbol = 'ETH'

  const onlyNumberChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = Number(target.value)
    if (Number.isNaN(value)) return
    setter(value)
  }

  // TODO: implementation this function.
  const onTrade = async () => {
    const { totalAmount, currentAmount } = await checkTrade('0x')
    const total = formatEther(totalAmount)
    const current = formatEther(currentAmount)

    isBuy ? buy(value) : sell(value)
  }

  return (
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

        <div className="flex justify-between w-full gap-2">
          <AlertDialog
            title={<p>Set max slippage</p>}
            footerClass="!flex-row-reverse gap-2"
            description={
              <div>
                <p className="mb-3">Set max trade slippage</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={slippage}
                    onChange={(e) => {
                      if (e.target.value.length > 4) return
                      onlyNumberChange(e, setSlippage)
                    }}
                  />
                  <span>%</span>
                </div>
              </div>
            }
          >
            <Button size="xs">
              {t('set-max-slippage')}({slippage}%)
            </Button>
          </AlertDialog>
        </div>
        <div className="flex flex-col my-6">
          <div className="flex items-center border rounded-md focus-within:border-black pr-2">
            <Input
              placeholder="0"
              border="none"
              disableFocusBorder
              className="flex-1"
              value={value}
              onChange={(e) => {
                if (e.target.value.length > 20) return
                onlyNumberChange(e, setValue)
              }}
            />
            <div className="flex items-center">
              <span className="mr-2 text-zinc-600">{symbol}</span>
              <img
                loading="lazy"
                decoding="async"
                width={20}
                height={20}
                src="/images/scroll.svg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="xs" onClick={() => setValue(0)}>
              {t('reset')}
            </Button>
            {(isBuy ? buyItems : sellItems).map((value, i) => (
              <Button size="xs" key={i} onClick={() => setValue(value)}>
                {value} {isBuy ? symbol : '%'}
              </Button>
            ))}
          </div>
        </div>
        <Button
          className="w-full"
          onClick={onTrade}
          disabled={isTrading || value <= 0}
        >
          {t('trade')}
        </Button>
      </Tabs>
    </Card>
  )
}

export default TradeTab
