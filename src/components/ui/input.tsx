import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  cn(
    'flex h-9 w-full rounded-md placeholder:text-muted-foreground',
    'bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ),
  {
    variants: {
      border: {
        default: 'border-2 border-black focus-visible:outline-none',
        none: 'focus-visible:outline-none focus-visible:ring-none',
      },
    },
    defaultVariants: {
      border: 'default',
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  disableFocusBorder?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  inputClass?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    disableFocusBorder = false,
    border,
    startIcon,
    endIcon,
    inputClass,
    ...restProps
  } = props

  if (startIcon || endIcon) {
    return (
      <div
        className={cn(
          'flex items-center border-2 border-black rounded-md',
          'focus-within:shadow-input2 duration-150',
          restProps.disabled && 'border-black/50',
          className,
        )}
      >
        {startIcon}
        <input
          className={cn(inputVariants({ border: 'none' }), 'ml-0', inputClass)}
          ref={ref}
          {...restProps}
        />
        {endIcon}
      </div>
    )
  }

  return (
    <input
      className={cn(
        inputVariants({ className, border }),
        'focus:shadow-input2',
      )}
      ref={ref}
      {...restProps}
    />
  )
})
Input.displayName = 'Input'

export { Input }
