import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'
import BigNumber from 'bignumber.js'

interface Props
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    'value'
  > {
  indicatorClass?: string
  withLabel?: boolean
  labelClass?: string
  value?: string | number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>((props, ref) => {
  const {
    className,
    value,
    indicatorClass,
    withLabel = true,
    labelClass,
    ...restProps
  } = props

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className
      )}
      {...restProps}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-primary transition-all',
          indicatorClass
        )}
        style={{
          transform: `translateX(-${BigNumber(100)
            .minus(value || 0)
            .toFixed()}%)`,
        }}
      />
      {withLabel && (
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm',
            labelClass
          )}
        >
          {value}%
        </div>
      )}
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
