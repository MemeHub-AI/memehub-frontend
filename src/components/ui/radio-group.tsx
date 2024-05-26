import * as React from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  disableFocusBorder?: boolean
  value?: any
  defaultValue?: any
  [key: string]: any
  classsName?: string
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('flex gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioItemVariants = cva('', {
  variants: {
    variant: {
      default: '',
      card: '',
    },
    size: {
      default: 'h-9 px-4 py-2',
      xs: 'h-6 rounded px-2 text-xs',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
      'icon-sm': 'h-8 w-8',
      'icon-xs': 'h-6 w-6 text-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioItemVariants>
>(
  (
    { className, variant = 'default', size = 'default', children, ...props },
    ref
  ) => {
    return (
      <RadioGroupPrimitive.Item ref={ref} className={cn('block')} {...props}>
        {children}
      </RadioGroupPrimitive.Item>
    )
  }
)
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
