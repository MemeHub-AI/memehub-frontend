import { useInfiniteQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import { first } from 'lodash'

import { inviteApi } from '@/api/invite'
import { RewardItem } from '@/api/invite/types'
import { useUserStore } from '@/stores/use-user-store'

const emptyArr = [] as any[]

export const useRewardTable = (columns: ColumnDef<RewardItem>[]) => {
  const { userInfo } = useUserStore()
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [inviteApi.getRewardList.name, userInfo?.id],
    queryFn: ({ pageParam }) => {
      if (userInfo?.id == null) {
        return Promise.reject()
      }
      return inviteApi.getRewardList({
        page: pageParam,
        page_size: 10,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => ({
      total: first(data.pages)?.data.count ?? 0,
      list: data.pages.flatMap((p) => p.data.results ?? []).filter(Boolean),
    }),
  })

  const table = useReactTable({
    data: data?.list ?? emptyArr,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return {
    table,
    list: data?.list ?? [],
    total: data?.total ?? 0,
    ths: table.getHeaderGroups(),
    rows: table.getRowModel().rows,
    fetchNextPage,
  }
}
