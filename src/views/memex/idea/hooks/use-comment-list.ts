import { memexApi } from '@/api/memex'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useCommentList = (hash: string | undefined) => {
  const {
    data: { comments = [], totalComments = 0 } = {},
    isLoading: isLoadingComments,
    refetch: refetchComments,
    fetchNextPage: fetchNextPageComments,
  } = useInfiniteQuery({
    queryKey: [memexApi.getIdeaComments.name, hash],
    queryFn: () => memexApi.getIdeaComments({ hash: hash! }),
    enabled: !!hash,
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => ({
      totalComments: pages[0]?.data?.count ?? 0,
      comments: pages.flatMap((p) => p.data.results).filter(Boolean),
    }),
  })

  return {
    comments,
    totalComments,
    isLoadingComments,
    refetchComments,
    fetchNextPageComments,
  }
}
