import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import clsx from 'clsx'
import { utilStyle } from '@/utils/style'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground shadow text-white bg-black',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 text-white bg-black',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-black bg-white',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground text-white bg-black',
        link: 'text-primary underline-offset-4 hover:underline text-white bg-black',
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
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  frontBgc?: string
  backBgc?: string
  frontTextColor?: string
  isFullWidth?: boolean
  isShadow?: boolean
  isReverse?: boolean
  offset?: {
    x: number
    y: number
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isFullWidth = false,
      asChild = false,
      isShadow,
      isReverse = false,
      frontBgc,
      frontTextColor,
      backBgc,
      offset,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const { classname, margin } = utilStyle.handleMargin(className)

    const handleReverse = () => {
      if (!isShadow) return ''
      return isReverse ? 'is-reverse-translate' : 'no-reverse-translate'
    }

    return (
      <div
        className={clsx(
          'relative  max-h-max h-min',
          margin,
          isFullWidth ? 'w-full' : 'w-max'
        )}
        style={{
          transform: `translate(${offset?.x || 0}px, ${offset?.y || 0}px)`,
        }}
      >
        <Comp
          ref={ref}
          className={cn(
            buttonVariants({ variant, size }),
            isShadow ? 'front-content' : '',
            `${handleReverse()}`,
            frontBgc && `${frontBgc} hover:${frontBgc}`,
            frontTextColor && `${frontTextColor} hover:${frontTextColor}`,
            ...classname
          )}
          {...props}
        />
        {isShadow ? (
          <div
            className={cn('back-content', `${backBgc} hover:${backBgc}`)}
          ></div>
        ) : null}
      </div>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
