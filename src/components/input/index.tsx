import React, { ComponentProps, RefAttributes, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Input as Inp } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import clsx from 'clsx'

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    ComponentProps<'input'> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  value?: string | number | readonly string[] | undefined
  disableFocusBorder?: boolean
  inputClassName?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    const { className, startIcon, endIcon, inputClassName, ...p } = props
    const [boxShadow, setBoxShadow] = useState('')
    const hasIcon = props.startIcon || props.endIcon

    return (
      <div
        className={cn(
          'flex items-center border-2 rounded-md w-full border-black',
          'focus-within:border-black focus-within:shadow group',
          'focus:shadow-[0_0_5px_3px_#A4C9EC!important]',
          className
        )}
        style={{
          boxShadow: boxShadow,
        }}
      >
        {startIcon ? startIcon : null}
        <Inp
          {...p}
          ref={ref}
          className={clsx('pl-2', inputClassName)}
          border={hasIcon ? 'none' : 'default'}
          disableFocusBorder
          value={props.value}
          onChange={props.onChange}
          onFocus={(e) => {
            setBoxShadow('0 0 5px 3px #A4C9EC')
            p.onFocus && p.onFocus(e)
          }}
          onBlur={(e) => {
            setBoxShadow('')
            p.onBlur && p.onBlur(e)
          }}
        />
        {endIcon ? endIcon : null}
      </div>
    )
  }
)

export default Input
