import React, { ComponentProps, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useDebounceEffect } from 'ahooks'

import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { tokenApi } from '@/api/token'
import { TokenListItem } from '@/api/token/types'
import { useChainsStore } from '@/stores/use-chains-store'

interface Props extends ComponentProps<typeof Input> {
  chianTag: string
  onSearched: (tokens: TokenListItem[]) => void
  onCleared?: () => void
}

export const TokenSearchInput = ({
  chianTag,
  className,
  onSearched,
  onCleared,
}: Props) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { chainsMap } = useChainsStore()

  const { data, mutateAsync, reset } = useMutation({
    mutationKey: [tokenApi.getList.name],
    mutationFn: tokenApi.getList,
  })

  const onSearch = async () => {
    if (isEmpty(value.trim())) return

    const { data: { results = [] } = {} } = await mutateAsync({
      page: 1,
      page_size: 50,
      token: value,
    })

    const tokens =
      chianTag === 'all' ? results : results.filter((c) => c.chain === chianTag)

    const result = tokens.filter(
      (c) =>
        c.name.toLowerCase().trim().includes(value.trim().toLowerCase()) ||
        c.symbol.toLowerCase().trim().includes(value.trim().toLowerCase())
    )

    onSearched(result)
  }

  useDebounceEffect(
    () => {
      onSearch()
    },
    [value],
    { wait: 500 }
  )

  useEffect(() => {
    if (isEmpty(value.trim())) {
      onCleared?.()
    }
  }, [value])

  useEffect(() => {
    setValue('')
  }, [chianTag])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
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
    </form>
  )
}

export default TokenSearchInput
