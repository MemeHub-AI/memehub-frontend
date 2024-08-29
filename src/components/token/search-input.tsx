import { type ComponentProps, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useDebounceEffect } from 'ahooks'

import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { tokenApi } from '@/api/token'
import { TokenListItem } from '@/api/token/types'
import { useTokensPools } from '@/hooks/token/use-tokens-pools'
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover'
import { TokenCard } from '../token-cards/token-card'

interface Props extends ComponentProps<'form'> {
  chianTag?: string
  onSearched?: (tokens: TokenListItem[]) => void
  onCleared?: () => void
  showPopover?: boolean
}

export const TokenSearchInput = ({
  chianTag,
  className,
  onSearched,
  onCleared,
  showPopover = true,
}: Props) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const { data, isPending, mutateAsync, reset } = useMutation({
    mutationKey: [tokenApi.getList.name],
    mutationFn: tokenApi.getList,
  })
  const tokens = data?.data?.results || []
  const { pools } = useTokensPools(tokens)

  const open = showPopover && (!isEmpty(tokens) || isPending)

  const onSearch = async () => {
    if (isEmpty(value.trim())) return

    const { data: { results = [] } = {} } = await mutateAsync({
      page: 1,
      page_size: 50,
      search: value,
    })

    const tokens =
      chianTag === 'all' ? results : results.filter((c) => c.chain === chianTag)

    const result = tokens.filter(
      (c) =>
        c.name.toLowerCase().trim().includes(value.trim().toLowerCase()) ||
        c.symbol.toLowerCase().trim().includes(value.trim().toLowerCase())
    )

    onSearched?.(result)
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
      className={className}
    >
      <Popover open={open} onOpenChange={reset}>
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
        <PopoverContent className="flex flex-col gap-3 w-[30rem] max-h-[50rem] overflow-auto">
          {tokens.map((t, i) => (
            <TokenCard
              key={t.id}
              card={t}
              descClass="line-clamp-2"
              className="min-w-24 min-h-40"
              hover="bg"
              shadow="none"
              onClick={reset}
              pool={pools[i]}
            />
          ))}
          {isPending && (
            <p className="text-zinc-500 text-center text-sm">
              {t('searching')}
            </p>
          )}
        </PopoverContent>
      </Popover>
    </form>
  )
}

export default TokenSearchInput
