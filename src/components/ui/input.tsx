import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  cn(
    'flex h-9 w-full rounded-md placeholder:text-muted-foreground',
    'bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ),
  {
    variants: {
      border: {
        default: 'border border-input focus-visible:outline-none',
        none: 'focus-visible:outline-none focus-visible:ring-none',
      },
    },
    defaultVariants: {
      border: 'default',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  disableFocusBorder?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disableFocusBorder = false, border, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ className, border }),
          !disableFocusBorder && 'focus-visible:ring-1 focus-visible:ring-ring'
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
