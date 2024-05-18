import { useInfiniteQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'

export const useTokens = () => {
  const { data } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [tokenApi.list.name],
    queryFn: ({ pageParam }) => {
      return tokenApi.list({
        page: pageParam.toString(),
        page_size: String(10),
      })
    },
    getNextPageParam: (_, __, page) => page + 1,
  })

  console.log('data', data)

  return {}
}
