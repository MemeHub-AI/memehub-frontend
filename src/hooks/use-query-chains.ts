import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { chainApi } from '@/api/chain'
import { useChainsStore } from '@/stores/use-chains-store'

export const useQueryChains = () => {
  const { setChains, setChainsMap } = useChainsStore()

  const {
    data: chains,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [chainApi.getChain.name],
    queryFn: chainApi.getChain,
    select: ({ data }) => data,
    refetchInterval: 30_000,
    retry: 10,
    retryDelay: 3_000,
  })

  useEffect(() => {
    if (chains) {
      setChains(chains)
      setChainsMap(chains)
    }
  }, [chains])

  return {
    chains: chains ?? [],
    isLoading,
    isFetching,
    refetch,
  }
}
