import { create } from 'zustand'

import type { ChainData } from '@/api/chain/type'

interface ChainsStore {
  chains: ChainData[]
  loadingChains: boolean

  setChains: (chains: ChainData[]) => void
  findChain: (nameOrId: string) => ChainData | undefined
}

export const useChainsStore = create<ChainsStore>((set, get) => ({
  chains: [],
  loadingChains: true,

  setChains: (chains) => {
    set({
      chains: chains.filter((c) => c.is_supported),
      loadingChains: false,
    })
  },
  findChain: (nameOrId) => {
    const { chains } = get()

    return chains.find(
      (chain) => chain.name === nameOrId || chain.id === nameOrId
    )
  },
}))
