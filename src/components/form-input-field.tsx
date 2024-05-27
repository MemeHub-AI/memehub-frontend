import React, { type ComponentProps, forwardRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'
import { Props, FormField } from './form-field'

export const FormInputField = forwardRef<
  HTMLInputElement,
  Omit<Props, 'render'> & ComponentProps<'input'>
>((props, ref) => {
  const { label, isRequired, error, ...restProps } = props

  return (
    <FormField
      label={label}
      isRequired={isRequired}
      error={error}
      id={restProps.id}
      render={
        <Input
          ref={ref}
          className={cn(error && 'border-red-600')}
          disableFocusBorder={!!error}
          {...restProps}
        />
      }
    />
  )
})
