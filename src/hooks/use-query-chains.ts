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
    refetchInterval: 30_000,
    select: ({ data }) => data,
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
