import SearchInput from '@/components/search-input'
import { TradeType } from '@/enums/trade'
import { useAllTrades } from '@/hooks/use-all-traces'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { utilColor } from '@/utils/color'
import { fmt } from '@/utils/fmt'
import { TokenTrade } from '@/views/token/hooks/use-token-ws/types'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { memo, useEffect, useState } from 'react'

const MemexHeaderMiddle = () => {
  const colors = utilColor.randomCreate()
  const { allTrades } = useAllTrades()
  const [soldTrade, setSoldTrade] = useState<TokenTrade>()
  const [buyTrade, setBuyTrade] = useState<TokenTrade>()
  const { push } = useRouter()

  useEffect(() => {
    console.log('all trades: ', allTrades)

    if (allTrades.length === 0) return

    if (allTrades[0].type === 'buy') {
      return setBuyTrade(allTrades[0])
    }

    return setSoldTrade(allTrades[0])
  }, [allTrades])

  const tradeType = (type: TradeType) => {
    switch (type) {
      case TradeType.Buy:
        return 'bought'
      case TradeType.Sell:
        return 'sold'
      default:
        return ''
    }
  }

  const tradeAmount = (amount: string) => {
    const afterAmount = amount.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')

    if (afterAmount.length > 5) return afterAmount.slice(0, 5) + '...'

    return afterAmount.slice(0, 5)
  }

  const ShakeCard: React.FC<{
    trade: TokenTrade
    className?: string
    textClass?: string
    imageClass?: string
    color: string
  }> = ({ trade, className, textClass, imageClass, color }) => {
    return (
      <div
        style={{ backgroundColor: color }}
        className={cn(
          'p-2 flex gap-2 items-center rounded-sm text-white font-medium animate-hori-shake',
          className
        )}
      >
        <span className={cn('text-nowrap text-sm', textClass)}>
          {/* executor */}
          <span
            className="hover:underline hover:underline-offset-1 hover:cursor-pointer"
            onClick={() =>
              push(`${Routes.MemexDetailsProfile}/${trade.executor}`)
            }
          >
            {trade.executor.slice(0, 3) + '...' + trade.executor.slice(-3)}
          </span>{' '}
          {/* trade value */}
          {tradeType(trade.type)} {tradeAmount(trade.quote_amount)}{' '}
          {/* trade symbol */}
          {trade.quote_symbol}
        </span>
        <img src={trade.image_url} className={cn('w-5 h-5', imageClass)} />
        <span
          className={cn(
            'text-nowrap text-sm hover:underline hover:underline-offset-1 hover:cursor-pointer',
            textClass
          )}
          onClick={() =>
            push(fmt.toHref(Routes.Main, trade.chain, trade.base_address))
          }
        >
          {trade.base_symbol}
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-between flex-1 mr-4">
      <div className="flex items-center space-x-2">
        {buyTrade && <ShakeCard color={colors[1]} trade={buyTrade} />}
        {soldTrade && <ShakeCard color={colors[2]} trade={soldTrade} />}
      </div>

      <SearchInput />
    </div>
  )
}

export default memo(MemexHeaderMiddle)
