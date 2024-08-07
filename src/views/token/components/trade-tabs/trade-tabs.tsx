import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TradeType } from '@/enums/trade'
import { useTradeTabsContext } from '@/contexts/trade-tabs'

export const TradeTabs = ({
  children,
  ...props
}: ComponentProps<typeof Tabs>) => {
  const { t } = useTranslation()
  const { disabled } = useTradeTabsContext()

  return (
    <Tabs {...props}>
      <TabsList className="grid grid-cols-2 h-11 mb-3">
        <TabsTrigger
          className="h-full font-bold"
          value={TradeType.Buy}
          disabled={disabled}
        >
          {t('trade.buy')}
        </TabsTrigger>
        <TabsTrigger
          className="h-full font-bold"
          value={TradeType.Sell}
          disabled={disabled}
        >
          {t('trade.sell')}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

export default TradeTabs
