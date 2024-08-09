import React, { ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useDebounceEffect } from 'ahooks'

import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import { tokenApi } from '@/api/token'
import { TokenCard } from './token-cards/card'
import { cn } from '@/lib/utils'

export const SearchInput = ({ className }: ComponentProps<typeof Input>) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const { data, isPending, mutateAsync, reset } = useMutation({
    mutationKey: [tokenApi.getList.name],
    mutationFn: tokenApi.getList,
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

  useDebounceEffect(onSearch, [value], { wait: 500 })

  return (
    <>
      <Popover open={!isEmpty(tokens) || isPending} onOpenChange={reset}>
        <PopoverAnchor>
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
        </PopoverAnchor>
        <PopoverContent className="flex flex-col gap-3 w-[30rem]">
          {tokens.map((t) => (
            <TokenCard
              key={t.id}
              card={t}
              descClass="line-clamp-2"
              className="w-24 h-24"
              hover="bg"
              shadow="none"
              // TODO: use dialog search instead
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
