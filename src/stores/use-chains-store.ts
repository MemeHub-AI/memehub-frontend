import { create } from 'zustand'

import type { ChainData } from '@/api/chain/type'

interface ChainsStore {
  chains: ChainData[]
  loadingChains: boolean

  setChains: (chains: ChainData[]) => void
  findChain: (nameOrId: string | number | undefined) => ChainData | undefined
  findChains: (namOrIds: (string | number | undefined)[]) => ChainData[]
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
  findChains: (nameOrIds) => {
    const { chains } = get()

    return chains.filter((chain) => {
      return nameOrIds.some((n) => {
        const ni = String(n)
        return chain.id === ni || chain.name === ni
      })
    })
  },
}))
