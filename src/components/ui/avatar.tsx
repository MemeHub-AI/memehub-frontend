import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { ShadowVariantsProps, shadowVariants } from '@/styles/variants'
import { defaultImg } from '@/config/link'
import { cva, VariantProps } from 'class-variance-authority'

const avatarVariants = cva('', {
  variants: {
    variant: {
      default: '',
      border: 'border-2 border-black',
    },
  },
})

interface Props
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    ShadowVariantsProps,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  size?: number
  fallback?: React.ReactNode
  fallbackClass?: string
  imgClass?: string
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  Props
>((props, ref) => {
  const {
    className,
    src,
    fallback,
    alt,
    size,
    fallbackClass,
    imgClass,
    shadow = 'none',
    variant,
    ...restProps
  } = props

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className,
        shadowVariants({ shadow }),
        avatarVariants({ variant })
      )}
      style={{ width: size, height: size }}
      {...restProps}
    >
      <AvatarImage
        src={src || defaultImg}
        alt={alt}
        className={cn('object-cover', imgClass)}
      />
      <AvatarFallback className={fallbackClass} children={fallback} />
    </AvatarPrimitive.Root>
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
