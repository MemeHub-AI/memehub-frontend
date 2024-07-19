import { create } from 'zustand'

import type { ChainData } from '@/api/chain/type'

type ChainsMap = Record<string | number, ChainData | undefined>

interface ChainsStore {
  chains: ChainData[]
  chainsMap: ChainsMap
  loadingChains: boolean

  setChains: (chains: ChainData[]) => void
  setChainsMap: (chains: ChainData[]) => void
  /*** @deprecated use `chainsMap` to instead. **/
  findChain: (nameOrId: string | number | undefined) => ChainData | undefined
  findChains: (namOrIds: (string | number | undefined)[]) => ChainData[]
}

export const useChainsStore = create<ChainsStore>((set, get) => ({
  chains: [],
  loadingChains: true,
  chainsMap: {},

  setChains: (chains) => {
    set({
      chains: chains.filter((c) => c.is_supported),
      loadingChains: false,
    })
  },
  setChainsMap: (allChains) => {
    const chains = allChains.filter((c) => c.is_supported)
    const chainsMap = chains.reduce((acc, cur) => {
      acc[cur.id] = cur
      acc[cur.name] = cur
      return acc
    }, {} as ChainsMap)

    set({ chainsMap, loadingChains: false })
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
