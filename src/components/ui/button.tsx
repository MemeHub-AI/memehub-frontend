import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { shadowVariants, ShadowVariantsProps } from '@/styles/variants'
import { useAudioPlayer } from '@/hooks/use-audio-player'

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center whitespace-nowrap ',
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
        outline: 'border-2 border-black hover:bg-zinc-100',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80]',
        ghost: 'border-transparent hover:bg-zinc-100',
        link: 'text-primary underline-offset-4 hover:underline text-white bg-black',
        warning: 'bg-orange-500 text-primary-foreground hover:bg-orange-500/90',
        yellow: 'bg-yellow-200 border-2 border-black hover:bg-yellow-200/90',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-6 rounded px-2 text-xs',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8 text-lg',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      className,
      variant,
      size,
      asChild = false,
      shadow,
      onClick,
      ...restProps
    } = props
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
        {...restProps}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
