import React, { type ComponentProps } from 'react'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { useTradeTabsContext } from '@/contexts/trade-tabs'
import { useTokenContext } from '@/contexts/token'
import { Skeleton } from '@/components/ui/skeleton'
import {
  tradeBuyItems,
  tradeDefaultItems,
  tradeSellItems,
} from '@/config/trade'

interface Props extends ComponentProps<'button'> {
  onItemClick?: (value: string) => void
}

export const TradeItems = ({ disabled, onItemClick }: Props) => {
  const { isLoadingTokenInfo, reserveSymbol, chainId } = useTokenContext()
  const { isBuy, tokenBalance } = useTradeTabsContext()
  const buyItems =
    tradeBuyItems[chainId as keyof typeof tradeBuyItems] ?? tradeDefaultItems

  const onSellClick = (value: string) => {
    const percent = BigNumber(value).div(100).multipliedBy(tokenBalance)

    if (percent.lte(0)) return
    onItemClick?.(percent.toFixed())
  }

  if (isLoadingTokenInfo) {
    return (
      <div className="flex mt-3">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-16 h-6 ml-2" />
        <Skeleton className="w-16 h-6 ml-2" />
        <Skeleton className="w-16 h-6 ml-2" />
      </div>
    )
  }

  return (
    <div className="flex mt-3 flex-wrap">
      {(isBuy ? buyItems : tradeSellItems).map((v, i) => (
        <Button
          size="xs"
          shadow="none"
          key={i}
          onClick={() => (isBuy ? onItemClick?.(v) : onSellClick(v))}
          disabled={disabled}
          type="button"
          className="mr-2 mb-2"
        >
          {v} {isBuy ? reserveSymbol : '%'}
        </Button>
      ))}
    </div>
  )
}

export default TradeItems
