import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { first } from 'lodash'

import { cn } from '@/lib/utils'
import { DataTable } from '@/components/data-table'
import { inviteApi } from '@/api/invite'
import { useUserStore } from '@/stores/use-user-store'
import { rewardColumns } from '../components/reward-columns'
import { RewardItem } from '@/api/invite/types'

const empty = [] as RewardItem[]

export const RewardTable = ({ className }: ComponentProps<'h2'>) => {
  const { t } = useTranslation()
  const { userInfo } = useUserStore()

  const {
    data: { list = [], total = 0 } = {},
    isLoading,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [inviteApi.getRewardList.name, userInfo?.id],
    queryFn: ({ pageParam }) => {
      return inviteApi.getRewardList({
        page: pageParam,
        page_size: 5,
      })
    },
    enabled: !!userInfo,
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => ({
      total: first(data.pages)?.data.count ?? 0,
      list: data.pages.flatMap((p) => p.data.results ?? []).filter(Boolean),
    }),
  })

  const table = useReactTable({
    data: list ?? empty,
    columns: rewardColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <h2 className={cn('font-bold text-2xl mb-2', className)}>
        {t('reward.record')}
      </h2>
      <DataTable
        containerClass="border-2 border-black rounded-md px-2 lg:w-4/5 2xl:w-3/5 max-sm:max-w-[94vw]"
        table={table}
        total={total}
        isLoading={isLoading}
        onFetchNext={fetchNextPage}
      />
    </>
  )
}

export default RewardTable
