import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useDebounce } from 'react-use'

import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import { tokenApi } from '@/api/token'
import { TokenCard } from './token-cards/card'

export const SearchInput = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const { data, isPending, mutateAsync, reset } = useMutation({
    mutationKey: [tokenApi.list.name],
    mutationFn: tokenApi.list,
  })
  const tokens = data?.data?.results || []

  const onSearch = () => {
    if (isEmpty(value.trim())) return

    mutateAsync({
      page: 1,
      page_size: 25,
      token: value,
    })
  }

  useDebounce(onSearch, 500, [value])

  return (
    <>
      <Popover open={!isEmpty(tokens) || isPending} onOpenChange={reset}>
        <PopoverAnchor>
          <Input
            className="shadow-offset"
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
        </PopoverAnchor>
        <PopoverContent className="flex flex-col gap-3 w-[30rem]">
          {tokens.map((t) => (
            <TokenCard
              key={t.id}
              card={t}
              imageSize={100}
              descClass="line-clamp-2"
              hover="bg"
              shadow="none"
              onClick={reset}
            />
          ))}
          {isPending && (
            <p className="text-zinc-500 text-center text-sm">
              {t('searching')}
            </p>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}

export default SearchInput
