import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import {
  shadowBorderVariants,
  ShadowBorderVariantsProps,
} from '@/styles/variants/offset-shadow'

const cardVariants = cva(
  'rounded-lg bg-card text-card-foreground transition-all duration-300',
  {
    variants: {
      padding: {
        none: '',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4',
        xl: 'p-6',
      },
      hover: {
        none: 'cursor-[unset]',
        default: 'cursor-default',
        pointer: 'cursor-pointer',
        bg: 'hover:bg-zinc-100 cursor-pointer',
        scale: 'hover:scale-105 cursor-pointer',
      },
      border: {
        none: 'border-none',
        default: 'border-2 border-black',
      },
    },
    defaultVariants: {
      hover: 'pointer',
      padding: 'none',
      border: 'default',
    },
  }
)

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants>,
    ShadowBorderVariantsProps {}

const colors = [
  '#f5cbb0',
  '#F0EDA8',
  '#EFB97F',
  '#c488c6',
  '#94CCED',
  '#8CE192',
  '#9b97ca',
  '#838AF2',
]

const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className, hover, padding, shadow, border, ...restProps } = props
  const randomIdx = Math.floor(Math.random() * colors.length)

  return (
    <div
      ref={ref}
      // @ts-ignore
      style={{ '--offset-color': shadow !== 'none' ? colors[randomIdx] : null }}
      className={cn(
        cardVariants({ hover, padding, border, className }),
        shadowBorderVariants({ shadow })
      )}
      {...restProps}
    />
  )
})

Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
