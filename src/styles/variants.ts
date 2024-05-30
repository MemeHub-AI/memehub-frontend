import { cva, VariantProps } from 'class-variance-authority'

export const shadowVariants = cva('transition-all ', {
  variants: {
    shadow: {
      none: '',
      default:
        'border-2 border-black shadow-offset hover:shadow-none hover:translate-x-offset hover:translate-y-offset',
    },
  },
  defaultVariants: {
    shadow: 'default',
  },
})

export type ShadowVariantsProps = VariantProps<typeof shadowVariants>

export const shadowBorderVariants = cva('transition-all ', {
  variants: {
    shadow: {
      none: '',
      default:
        'border-2 border-black hover:shadow-offset-border hover:-translate-x-offset hover:-translate-y-offset',
    },
  },
  defaultVariants: {
    shadow: 'default',
  },
})

export type ShadowBorderVariantsProps = VariantProps<
  typeof shadowBorderVariants
>
