import { create } from 'zustand'

import type { ChainData } from '@/api/chain/type'

type ChainsMap = Record<string | number, ChainData | undefined>

interface ChainsStore {
  chains: ChainData[]
  /**
   * @example example for find a chain.
   * ```ts
   * const chain1 = chainsMap[56]
   * const chain2 = chainsMap['bsc']
   * ```
   */
  chainsMap: ChainsMap
  loadingChains: boolean

  setChains: (chains: ChainData[]) => void
  setChainsMap: (chains: ChainData[]) => void
  /** If you want to find a single chain, please use `chainsMap` */
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
    // Trade space for time.
    const chainsMap = chains.reduce((acc, cur) => {
      acc[cur.id] = cur
      acc[cur.name] = cur
      return acc
    }, {} as ChainsMap)

    set({ chainsMap, loadingChains: false })
  },
  findChains: (nameOrIds) => {
    const { chainsMap } = get()
    const chains: ChainData[] = []

    for (let i = 0; i < nameOrIds.length; i++) {
      const key = nameOrIds[i]
      if (key && chainsMap[key]) chains.push(chainsMap[key])
    }

    return chains
  },
}))
