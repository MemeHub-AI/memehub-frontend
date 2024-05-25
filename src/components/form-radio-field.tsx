import React, { type ComponentProps, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Props, FormField } from './form-field'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

export const FromRadioField = forwardRef<
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
        <RadioGroup
          className={cn(error && 'border-red-600')}
          disableFocusBorder={!!error}
          {...restProps}
          ref={ref}
        >
          {[restProps.value as string[]].map((value: any) => {
            return (
              <RadioGroupItem value={value.id}>
                <Label htmlFor="r1">{value.label}</Label>
              </RadioGroupItem>
            )
          })}
        </RadioGroup>
      }
    />
  )
})
