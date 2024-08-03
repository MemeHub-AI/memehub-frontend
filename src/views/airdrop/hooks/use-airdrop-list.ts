import { useInfiniteQuery } from '@tanstack/react-query'

import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'

export const useAirdropList = () => {
  const { userInfo } = useUserStore()

  const {
    data: { total = 0, airdrops = [] } = {},
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [airdropApi.getList.name, userInfo?.id],
    queryFn: async ({ pageParam }) => {
      if (userInfo?.id == null) return Promise.reject()

      const { data } = await airdropApi.getList({ page: pageParam })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        airdrops: data.pages.flatMap((p) => p?.results).filter(Boolean),
      }
    },
    enabled: false, // TODO: waiting for enable
  })

  return {
    total,
    airdrops,
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
