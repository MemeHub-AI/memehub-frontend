import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  disableFocusBorder?: boolean
  disableFocusShadow?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disableFocusBorder, disableFocusShadow, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input',
          'bg-transparent px-3 py-2 text-sm shadow-sm',
          'placeholder:text-muted-foreground focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !disableFocusBorder && 'focus-visible:ring-1 focus-visible:ring-ring',
          !disableFocusShadow &&
            'focus:shadow-[0_0_5px_3px_#A4C9EC!important] border-2 rounded-md w-full border-black',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
