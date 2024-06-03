import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        none: '',
        icon: cn(
          'h-9 w-9 border border-input bg-background shadow-sm rounded-md',
          'inline-flex justify-center items-center cursor-pointer',
          'hover:bg-accent hover:text-accent-foreground'
        ),
      },
    },
    defaultVariants: {
      variant: 'none',
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & { disabled?: boolean }
>(({ className, variant, disabled, onClick, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      disabled && 'opacity-50',
      labelVariants({ variant }),
      className
    )}
    onClick={disabled ? undefined : onClick}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
