import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import clsx from 'clsx'

const cardVariants = cva(
  cn(
    'rounded-xl bg-card text-card-foreground transition-all',
    'duration-300 cursor-pointer border shadow'
  ),
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
        border: 'hover:shadow-bold',
        bg: 'hover:bg-zinc-100',
      },
    },
    defaultVariants: {
      hover: 'none',
      padding: 'none',
    },
  }
)

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isShadow?: boolean
  isReverse?: boolean
  isRandomBackBgc?: boolean
  frontBgc?: string
  frontColor?: string
  backBgc?: string
}

const randomColor = [
  '!bg-[#f5cbb0]',
  '!bg-[#F0EDA8]',
  '!bg-[#EFB97F]',
  '!bg-[#c488c6]',
  '!bg-[#94CCED]',
  '!bg-[#8CE192]',
  '!bg-[#9b97ca]',
  '!bg-[#838AF2]',
]

const Card = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      hover,
      padding,
      isShadow = false,
      isReverse = true,
      isRandomBackBgc = true,
      frontBgc,
      frontColor,
      backBgc = 'bg-black',
      ...props
    },
    ref
  ) => {
    const handleReverse = () => {
      if (!isShadow) return ''
      return isReverse ? 'is-reverse-translate' : 'no-reverse-translate'
    }

    const randomNumber = Math.floor(Math.random() * 8)

    return (
      <div className="relative">
        <div
          ref={ref}
          className={cn(
            cardVariants({ className, padding }),
            isShadow ? 'front-content card' : '',
            `${handleReverse()}`,
            `${frontBgc} hover:${frontBgc}`,
            `${frontColor} hover:${frontColor}`
          )}
          {...props}
        />
        {isShadow ? (
          <div
            className={clsx(
              'back-content card',
              isRandomBackBgc
                ? `${randomColor[randomNumber]}`
                : `${backBgc} hover:${backBgc}`
            )}
          ></div>
        ) : null}
      </div>
    )
  }
)

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
