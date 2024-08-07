import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { chainApi } from '@/api/chain'
import { useChainsStore } from '@/stores/use-chains-store'
import { ChainData } from '@/api/chain/type'
import { Network } from '@/constants/contract'

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

  // TODO: Remove this when tonchain is ready.
  const tonChain: ChainData = {
    id: '0',
    name: 'ton',
    logo: 'https://storage.memehub.ai/chains/logo/ton.png',
    is_supported: true,
    displayName: 'Ton',
    network: Network.Tvm,
    native: {
      decimals: 9,
      name: 'Ton',
      symbol: 'TON',
    },
  }

  useEffect(() => {
    if (chains) {
      setChains([...chains, tonChain])
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
