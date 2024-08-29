import { create } from 'zustand'

import type { ChainData } from '@/api/chain/type'
import { Network } from '@/enums/contract'

type ChainsMap = Record<string | number, ChainData | undefined>

interface ChainsStore {
  chains: ChainData[]
  loadingChains: boolean
  /** All chains, only allowing matching by chainName. */
  chainsMap: ChainsMap
  evmChainsMap: ChainsMap // Matching by name and id.
  svmChiansMap: ChainsMap // Matching by name and id.
  tvmChainsMap: ChainsMap // Matching by name and id.

  setChains: (chains: ChainData[]) => void
  setChainsMap: (chains: ChainData[]) => void
  /** If you want to find a single chain, please use `chainsMap` */
  findChains: (namOrIds: (string | number | undefined)[]) => ChainData[]
  getChainId: (
    chainName: string | undefined | null,
    fallback?: number
  ) => number
}

export const useChainsStore = create<ChainsStore>((set, get) => ({
  chains: [],
  loadingChains: true,
  chainsMap: {},
  evmChainsMap: {},
  svmChiansMap: {},
  tvmChainsMap: {},

  setChains: (chains) => set({ chains, loadingChains: false }),
  setChainsMap: (chains) => {
    const chainsMap: ChainsStore['chainsMap'] = {}
    const evmChainsMap: ChainsStore['evmChainsMap'] = {}
    const svmChiansMap: ChainsStore['svmChiansMap'] = {}
    const tvmChainsMap: ChainsStore['tvmChainsMap'] = {}

    for (const c of chains) {
      chainsMap[c.name] = c

      if (c.network === Network.Evm) {
        evmChainsMap[c.id] = c
        evmChainsMap[c.name] = c
      } else if (c.network === Network.Svm) {
        svmChiansMap[c.id] = c
        svmChiansMap[c.name] = c
      } else if (c.network === Network.Tvm) {
        tvmChainsMap[c.id] = c
        tvmChainsMap[c.name] = c
      }
    }

    set({
      chainsMap,
      evmChainsMap,
      svmChiansMap,
      tvmChainsMap,
      loadingChains: false,
    })
  },
  findChains: (nameOrIds) => {
    const { evmChainsMap } = get()
    const chains: ChainData[] = []

    for (let i = 0; i < nameOrIds.length; i++) {
      const key = nameOrIds[i]
      if (key && evmChainsMap[key]) chains.push(evmChainsMap[key])
    }

    return chains
  },
  getChainId: (name, fallback) =>
    Number(get().chainsMap[name || '']?.id || fallback || 0),
}))
