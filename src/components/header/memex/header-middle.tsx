import SearchInput from '@/components/search-input'
import { TradeType } from '@/enums/trade'
import { useAllTrades } from '@/hooks/use-all-traces'
import { cn } from '@/lib/utils'
import { utilColor } from '@/utils/color'
import { TokenTrade } from '@/views/token/hooks/use-token-ws/types'
import { t } from 'i18next'
import { memo, useEffect, useState } from 'react'

const MemexHeaderMiddle = () => {
  const colors = utilColor.randomCreate()
  const { allTrades } = useAllTrades()
  const [soldTrade, setSoldTrade] = useState<TokenTrade>()
  const [buyTrade, setBuyTrade] = useState<TokenTrade>()

  useEffect(() => {
    console.log('all trades: ', allTrades)
    if (allTrades.length !== 0) {
      if (allTrades[0].type === 'buy') {
        return setBuyTrade(allTrades[0])
      }

      return setSoldTrade(allTrades[0])
    }
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
        {/* <img src={srcs} className={cn('w-5 h-5 rounded-md', imageClass)} /> */}
        {
          <div>
            <span className={cn('text-nowrap text-sm', textClass)}>
              <span className="hover:underline hover:underline-offset-1 hover:cursor-pointer">
                {trade.base_address.slice(0, 3) +
                  '...' +
                  trade.base_address.slice(-3)}
              </span>{' '}
              {tradeType(trade.type)} {trade.quote_amount} {trade.quote_symbol}
            </span>
            <img
              src={'/images/logo.png'}
              className={cn('w-5 h-5', imageClass)}
            />
            <span
              className={cn(
                'text-nowrap text-sm hover:underline hover:underline-offset-1 hover:cursor-pointer',
                textClass
              )}
            >
              {trade.base_symbol}
            </span>
          </div>
        }
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
