import React, { type ReactNode, type ComponentProps } from 'react'

import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { cn } from '@/lib/utils'

export type Props = {
  render: ReactNode
  label?: string
  isRequired?: boolean
  error?: string | null
} & (ComponentProps<'textarea'> | ComponentProps<'input'>)

export const FormField = (props: Props) => {
  const { render, label, isRequired, error, className, ...restProps } = props

  return (
    <div className={cn('space-y-1 relative', className)}>
      {label && (
        <Label htmlFor={restProps.id} className={cn(!!error && 'text-red-600')}>
          {isRequired && '*'}
          {label}:
        </Label>
      )}
      {render}
      {error && <p className="text-red-600 text-xs absolute">{error}</p>}
    </div>
  )
}

interface TextareaProps extends Omit<Props, 'render'> {
  disableFocusBorder?: boolean
}

export const FormTextareaField = (
  props: TextareaProps & ComponentProps<'textarea'>
) => {
  const { label, isRequired, error, disableFocusBorder, ...restProps } = props

  return (
    <FormField
      label={label}
      isRequired={isRequired}
      error={error}
      id={restProps.id}
      render={
        <Textarea
          className={cn(error && 'border-red-600')}
          disableFocusBorder={disableFocusBorder || !!error}
          {...restProps}
        />
      }
    />
  )
}

export default FormField
