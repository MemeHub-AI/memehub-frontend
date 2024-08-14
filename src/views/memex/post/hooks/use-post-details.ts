import { useQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'

export const usePostDetails = (hash: string | undefined) => {
  const {
    data: details,
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: [memexApi.getPostDetail.name, hash],
    queryFn: () => memexApi.getPostDetail(hash!),
    enabled: !!hash,
    select: ({ data }) => data,
  })

  return {
    details,
    isLoadingDetails,
    refetchDetails,
  }
}
