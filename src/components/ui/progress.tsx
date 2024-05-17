import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

interface Props
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClass?: string
  label?: React.ReactNode
  labelFormat?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>((props, ref) => {
  const {
    className,
    value,
    indicatorClass,
    label,
    labelFormat = true,
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
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {label && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
          {label}
          {labelFormat && '%'}
        </div>
      )}
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
