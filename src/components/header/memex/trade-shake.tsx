import { TradeType } from '@/enums/trade'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ShakeCardProps } from './type'
import { TokenTrade } from '@/views/token/hooks/use-token-ws/types'

const TradeShake = (props: ShakeCardProps<TokenTrade>) => {
  const { trade, className, textClass, imageClass, color } = props
  const { push } = useRouter()

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

  const ShakeCard = useMemo(
    () => () => {
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
            {tradeType(trade.type)}{' '}
            {fmt.decimals(trade.quote_amount, { round: true })}
            {/* trade symbol */} {trade.quote_symbol}
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
    },
    [trade]
  )

  return <ShakeCard />
}

export default TradeShake
