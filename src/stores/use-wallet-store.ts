import { create } from 'zustand'

import { ChainData } from '@/api/chain/type'

interface WalletStore {
  connectOpen: boolean
  loadingChains: boolean
  chains: ChainData[]
  setChains: (chains: ChainData[]) => void
  setConnectOpen: (open: boolean) => void
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  connectOpen: false,
  loadingChains: true,
  chains: [],
  setChains: (chains) => {
    set({ chains: chains.filter((c) => c.is_supported), loadingChains: false })
  },
  setConnectOpen: (open) => set({ connectOpen: open }),
}))
