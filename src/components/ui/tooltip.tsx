import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

interface Props extends TooltipPrimitive.TooltipProps {
  tip: React.ReactNode
  children: React.ReactNode
  triggerProps?: Omit<TooltipPrimitive.TooltipTriggerProps, 'children'>
  className?: string
}

/**
 * @example
 * ```tsx
 * <Tooltip tip={<div>your tips</div>}>
 *  <div>your trigger<div>
 * </Tooltip>
 * ```
 */
const Tooltip = ({
  tip,
  children,
  delayDuration = 300,
  triggerProps,
  className,
  ...props
}: Props) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root delayDuration={delayDuration} {...props}>
        <TooltipTrigger asChild {...triggerProps}>
          {children}
        </TooltipTrigger>
        <TooltipContent className={className}>{tip}</TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
