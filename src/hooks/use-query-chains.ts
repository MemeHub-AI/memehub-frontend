import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { chainApi } from '@/api/chain'
import { useChainsStore } from '@/stores/use-chains-store'

export const useQueryChains = () => {
  const { setChains } = useChainsStore()

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [chainApi.getChain.name],
    queryFn: chainApi.getChain,
    refetchInterval: 60_000, // 1 minutes
  })

  useEffect(() => {
    if (data?.data) {
      setChains(data.data)
    }
  }, [data, isError])

  return {
    chains: data?.data || [],
    isLoading,
    isFetching,
    isError,
    refetch,
  }
}
