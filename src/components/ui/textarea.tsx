import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  disableFocusBorder?: boolean
  disableFocusShadow?: boolean
  disableMaxLen?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (p, ref) => {
    const {
      className,
      disableFocusBorder,
      disableFocusShadow,
      maxLength,
      value,
      disableMaxLen = false,
      ...props
    } = p

    const withMaxLength = (children: React.ReactNode) => {
      if (maxLength === undefined || disableMaxLen) return children
      const currentLen = value?.toString().length || 0

      return (
        <div className="text-right">
          {children}
          <span
            className={cn(
              'text-zinc-500 text-sm leading-none',
              currentLen >= maxLength && 'text-red-500'
            )}
          >
            {currentLen}/{maxLength}
          </span>
        </div>
      )
    }

    return withMaxLength(
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input',
          'bg-transparent px-3 py-2 text-sm shadow-sm relative',
          'placeholder:text-muted-foreground focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !disableFocusBorder && 'focus-visible:ring-1 focus-visible:ring-ring',
          !disableFocusShadow &&
            'focus:shadow-[0_0_5px_3px_#A4C9EC!important] border-2 rounded-md w-full border-black',
          className
        )}
        ref={ref}
        value={value}
        maxLength={maxLength}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
