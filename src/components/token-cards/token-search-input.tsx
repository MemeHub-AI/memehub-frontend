import React, { ComponentProps, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'react-use'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { tokenApi } from '@/api/token'
import { TokenListItem } from '@/api/token/types'

interface Props extends ComponentProps<typeof Input> {
  onSearched: (tokens: TokenListItem[]) => void
  onCleared?: () => void
}

export const TokenSearchInput = (props: Props) => {
  const { className, onSearched, onCleared } = props
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const { data, mutateAsync, reset } = useMutation({
    mutationKey: [tokenApi.list.name],
    mutationFn: tokenApi.list,
  })

  const onSearch = async () => {
    if (isEmpty(value.trim())) return

    const { data } = await mutateAsync({
      page: 1,
      page_size: 50,
      token: value,
    })
    const tokens = data.results ?? []

    onSearched(tokens)
  }

  useDebounce(onSearch, 500, [value])

  useEffect(() => {
    if (isEmpty(value.trim())) {
      onCleared?.()
    }
  }, [value])

  return (
    <Input
      className={cn('shadow-offset h-9 select-none', className)}
      value={value}
      onChange={({ target }) => setValue(target.value)}
      placeholder={t('search.placeholder')}
      startIcon={
        <MagnifyingGlassIcon
          width={18}
          height={18}
          className="cursor-pointer ml-2"
          onClick={onSearch}
        />
      }
    />
  )
}

export default TokenSearchInput
