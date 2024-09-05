import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { linkStyle } from '@/styles/variants/link'
import { useTokenContext } from '@/contexts/token'
import { DatafeedCandles } from './hooks/use-datafeed/types'

interface Props extends Omit<ComponentProps<'div'>, 'onClick'> {
  activeUnit: keyof DatafeedCandles
  onClick: (unit: keyof DatafeedCandles) => void
}

export const ChartUnitButton = ({
  className,
  activeUnit,
  onClick,
  ...props
}: Props) => {
  const { tokenChain } = useTokenContext()

  return (
    <div className={cn('text-sm mr-2', className)} {...props}>
      <button
        className={linkStyle(activeUnit === 'master' && 'text-blue-600')}
        onClick={() => onClick('master')}
      >
        {tokenChain?.native.symbol}
      </button>
      /
      <button
        className={linkStyle(activeUnit === 'usd' && 'text-blue-600')}
        onClick={() => onClick('usd')}
      >
        USD
      </button>
    </div>
  )
}

export default ChartUnitButton
