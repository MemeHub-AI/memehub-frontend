import { TradeType } from '@/enums/trade'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ShakeCardProps } from './type'
import { TokenWsTrade } from '@/views/token/hooks/use-token-ws/types'
import { joinPaths } from '@/utils'
import { animatedShakeRef } from '@/utils/animation'

const TradeShake = (props: ShakeCardProps<TokenWsTrade>) => {
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
            'p-2 flex gap-1 items-center rounded-sm text-white font-medium ',
            className
          )}
          ref={animatedShakeRef}
        >
          <span className={cn('text-nowrap text-sm', textClass)}>
            {/* executor */}
            <span
              className="hover:underline hover:underline-offset-1 hover:cursor-pointer"
              onClick={() => push(joinPaths(Routes.Account, trade.executor))}
            >
              {fmt.fileName(trade.executor, 3, 3)}
            </span>{' '}
            {/* trade value */}
            {tradeType(trade.type)}{' '}
            {fmt.decimals(trade.quote_amount, { round: true })}
            {/* trade symbol */} {trade.quote_symbol}
          </span>
          <img
            src={trade.image_url}
            className={cn('w-5 h-5 rounded-full object-cover', imageClass)}
          />
          <span
            className={cn(
              'text-nowrap text-sm hover:underline hover:underline-offset-1 hover:cursor-pointer',
              textClass
            )}
            onClick={() =>
              push(joinPaths(Routes.Main, trade.chain, trade.base_address))
            }
          >
            {fmt.ellipsis(trade.base_symbol, 13)}
          </span>
        </div>
      )
    },
    [trade]
  )

  return <ShakeCard />
}

export default TradeShake
