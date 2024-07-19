import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  disableFocusBorder?: boolean
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
>((p, ref) => {
  const {
    className,
    variant = 'default',
    size = 'default',
    children,
    ...props
  } = p

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn('block', props.disabled && 'opacity-50', className)}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
