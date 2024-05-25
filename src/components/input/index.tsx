import React, { ComponentProps, useState } from 'react'
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
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const Input = (props: InputProps) => {
  const { className, startIcon, endIcon, ...p } = props
  const [boxShadow, setBoxShadow] = useState('')
  const hasIcon = props.startIcon || props.endIcon

  return (
    <div
      className={cn(
        'flex items-center border-2 rounded-md w-full border-black',
        'focus-within:border-black focus-within:shadow group',
        'focus:shadow-[0_0_5px_3px_#ED8181!important]',
        className
      )}
      style={{
        boxShadow: boxShadow,
      }}
    >
      {startIcon ? startIcon : null}
      <Inp
        {...p}
        className={clsx('pl-2')}
        border={hasIcon ? 'none' : 'default'}
        disableFocusBorder
        value={props.value}
        onChange={props.onChange}
        onFocus={() => setBoxShadow('0 0 5px 3px #ED8181')}
        onBlur={() => setBoxShadow('')}
      />
      {endIcon ? endIcon : null}
    </div>
  )
}

export default Input
