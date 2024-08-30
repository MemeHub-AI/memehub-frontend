import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import {
  shadowVariants,
  ShadowVariantsProps,
} from '@/styles/variants/offset-shadow'
import { useAudioPlayer } from '@/hooks/use-audio-player'

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center whitespace-nowrap select-none',
    'rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-1',
    'focus-visible:ring-ring disabled:pointer-events-none',
    'disabled:opacity-50 transition-all duration-100 bg-white'
  ),
  {
    variants: {
      variant: {
        default:
          'text-primary-foreground !shadow-offset-border hover:!shadow-none text-white bg-black',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border-2 border-black sm:hover:opacity-90 active:opacity-90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80]',
        ghost: 'border-transparent sm:hover:opacity-90 active:opacity-90',
        link: 'text-primary underline-offset-4 hover:underline text-white bg-black',
        warning: 'bg-orange-500 text-primary-foreground hover:bg-orange-500/90',
        yellow: 'bg-yellow-200 border-2 border-black sm:hover:bg-yellow-200/90',
        purple:
          'bg-purple-700 border-none sm:hover:bg-purple-700/90 active:bg-purple-700/90 text-white',
        circle:
          'h-9 w-9 rounded-full bg-black/60 text-white sm:hover:bg-black/80 active:bg-black/80',
        red: 'bg-red-500 border-none sm:hover:bg-red-500/90 active:bg-red-500/90 text-white',
        'hover-circle':
          'h-9 w-9 rounded-full sm:hover:bg-zinc-100 !duration-300 shrink-0 !p-1',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-6 rounded px-2 text-xs',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8 text-lg',
        'icon-2xl': 'h-14 w-14',
        'icon-xl': 'h-12 w-12',
        'icon-lg': 'h-11 w-11',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-sm2': 'h-7 w-7 text-sm',
        'icon-xs': 'h-6 w-6 text-xs',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    ShadowVariantsProps {
  asChild?: boolean
  isLoading?: boolean
  loadingChild?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((p, ref) => {
  const {
    className,
    variant,
    size,
    asChild = false,
    shadow,
    onClick,
    children,
    isLoading,
    loadingChild,
    disabled,
    ...props
  } = p
  const Comp = asChild ? Slot : 'button'
  const { playGua } = useAudioPlayer()

  return (
    <Comp
      ref={ref}
      className={cn(
        buttonVariants({ variant, size }),
        shadowVariants({ shadow }),
        className,
        'min-w-5'
      )}
      onClick={(e) => {
        playGua()
        onClick?.(e)
      }}
      disabled={disabled || isLoading}
      children={isLoading && loadingChild ? loadingChild : children}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
