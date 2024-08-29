import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { useTranslation } from 'react-i18next'
import { Cross2Icon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { shadowVariants } from '@/styles/variants/offset-shadow'

interface Props extends AlertDialogPrimitive.AlertDialogProps {
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  triggerProps?: AlertDialogPrimitive.AlertDialogTriggerProps
  footerClass?: string
  showFooter?: boolean
  showCancel?: boolean
  confirmText?: string
  align?: 'left' | 'center' | 'right'
  showClose?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

const AlertDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Root>,
  Props
>((props, ref) => {
  const {
    children,
    title,
    description,
    content,
    onCancel,
    onConfirm,
    triggerProps,
    footerClass,
    showFooter = true,
    showCancel = true,
    align = 'left',
    confirmText,
    showClose = false,
    ...restProps
  } = props
  const { t } = useTranslation()
  const closeRef = React.useRef<HTMLButtonElement>(null)

  return (
    <AlertDialogPrimitive.Root {...restProps}>
      {!!children && (
        <AlertDialogTrigger asChild={!!children} {...triggerProps}>
          {children}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="max-sm:w-[90%] " ref={ref}>
        {title && (
          <AlertDialogHeader className="relative">
            <AlertDialogTitle
              className={cn(align === 'center' && '!text-center')}
            >
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        {showClose && (
          <div
            className="absolute top-2 right-2 cursor-pointer"
            onClick={(e) => {
              closeRef.current?.click()
              onCancel?.()
            }}
          >
            <AlertDialogCancel ref={closeRef} className="hidden" />
            <Cross2Icon className="h-6 w-6" />
          </div>
        )}
        {content}
        {showFooter && (
          <AlertDialogFooter
            className={cn(
              'sm:justify-start max-sm:flex max-sm:flex-row max-sm:space-x-4',
              footerClass,
              // Add `mr-3` offset, because button have shadow.
              align === 'center' && '!justify-center mr-3'
            )}
          >
            <AlertDialogAction onClick={onConfirm} className="max-sm:flex-1">
              {confirmText ?? t('confirm')}
            </AlertDialogAction>
            {showCancel && (
              <AlertDialogCancel
                onClick={onCancel}
                className="max-sm:mt-0 max-sm:flex-1"
              >
                {t('cancel')}
              </AlertDialogCancel>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  )
})

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <div className="fixed left-0 top-0 w-full h-full z-[10000] bg-black/80">
    <AlertDialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-[10000] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
      ref={ref}
    />
  </div>
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-[1000000001] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'default' }),
      shadowVariants(),
      className
    )}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'outline' }),
      shadowVariants(),
      'mt-2 sm:mt-0',
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
