import { create } from 'zustand'

import type { ChainData } from '@/api/chain/type'

interface ChainsStore {
  chains: ChainData[]
  loadingChains: boolean

  setChains: (chains: ChainData[]) => void
  findChain: (nameOrId: string | number | undefined) => ChainData | undefined
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
    if (!nameOrId) return
    const { chains } = get()
    const ni = String(nameOrId)

    return chains.find((chain) => chain.name === ni || chain.id === ni)
  },
}))
