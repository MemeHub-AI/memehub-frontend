import { useQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'

export const useIdeaDetails = (hash: string | undefined) => {
  const {
    data: details,
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: [memexApi.getIdeaDetail.name, hash],
    queryFn: () => memexApi.getIdeaDetail(hash!),
    enabled: !!hash,
    select: ({ data }) => data,
  })

  return {
    details,
    isLoadingDetails,
    refetchDetails,
  }
}
