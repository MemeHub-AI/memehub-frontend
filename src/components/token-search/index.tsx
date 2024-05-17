import React, { ComponentProps, useState } from 'react'
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const TokenSearch = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const onSearch = () => {}

  return (
    <div
      className={cn(
        'flex items-center px-2 border rounded-md w-full',
        'focus-within:border-black focus-within:shadow group',
        className
      )}
    >
      <MagnifyingGlassIcon
        width={18}
        height={18}
        className="cursor-pointer"
        onClick={onSearch}
      />
      <Input
        className="pl-2"
        border="none"
        disableFocusBorder
        placeholder={t('search.placeholder')}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
    </div>
  )
}

export default TokenSearch
