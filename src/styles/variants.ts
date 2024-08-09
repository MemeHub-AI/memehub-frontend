import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

export const shadowVariants = cva('transition-all duration-100', {
  variants: {
    shadow: {
      none: '',
      default: cn(
        'border-2 border-black shadow-offset active:shadow-none',
        'active:translate-x-offset active:translate-y-offset',
        'sm:hover:shadow-none sm:hover:translate-x-offset sm:hover:translate-y-offset'
      ),
    },
  },
  defaultVariants: {
    shadow: 'default',
  },
})

export type ShadowVariantsProps = VariantProps<typeof shadowVariants>

export const shadowBorderVariants = cva('transition-all duration-100', {
  variants: {
    shadow: {
      none: '',
      default: cn(
        'border-2 border-black active:shadow-offset-border',
        'active:-translate-x-offset active:-translate-y-offset',
        'sm:hover:shadow-offset-border sm:hover:-translate-x-offset sm:hover:-translate-y-offset'
      ),
    },
  },
  defaultVariants: {
    shadow: 'default',
  },
})

export type ShadowBorderVariantsProps = VariantProps<
  typeof shadowBorderVariants
>
