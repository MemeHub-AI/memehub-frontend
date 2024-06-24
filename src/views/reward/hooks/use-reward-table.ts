import { useInfiniteQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import { first } from 'lodash'

import { inviteApi } from '@/api/invite'
import { RewardItem } from '@/api/invite/types'

const page = 1

const page_size = 10

const emptyArr = [] as any[]

export const useRewardTable = (columns: ColumnDef<RewardItem>[]) => {
  const { data } = useInfiniteQuery({
    queryKey: [inviteApi.getRewardList.name],
    queryFn: () => {
      return inviteApi.getRewardList({ page, page_size })
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
    page,
    page_size,
  }
}
