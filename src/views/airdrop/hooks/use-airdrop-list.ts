import { useInfiniteQuery } from '@tanstack/react-query'

import { airdropApi } from '@/api/airdrop'
import { useUserStore } from '@/stores/use-user-store'

export const useAirdropList = () => {
  const { userInfo } = useUserStore()

  const {
    data: { totalAirdrops = 0, airdrops = [] } = {},
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [airdropApi.getList.name, userInfo?.id],
    queryFn: ({ pageParam }) => airdropApi.getList({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => {
      return {
        totalAirdrops: pages[0].data.count,
        airdrops: pages.flatMap((p) => p?.data.results).filter(Boolean),
      }
    },
    enabled: !!userInfo,
  })

  return {
    totalAirdrops,
    airdrops,
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
