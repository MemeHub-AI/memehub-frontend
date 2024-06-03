import { create } from 'zustand'

import type { WSTradeInfoMessage } from '@/api/websocket/types'

interface HoldersStore {
  marketCap: number
  virtualLiquidity: number
  holders: WSTradeInfoMessage['holders']

  setMarketCap: (marketCap: number) => void
  setVirtualLiquidity: (virtualLiquidity: number) => void
  setHolders: (holders: WSTradeInfoMessage['holders']) => void
}

export const useHoldersStore = create<HoldersStore>((set) => ({
  marketCap: 0,
  virtualLiquidity: 0,
  holders: [],

  setMarketCap: (marketCap) => set(() => ({ marketCap })),
  setVirtualLiquidity: (virtualLiquidity) => set(() => ({ virtualLiquidity })), // 虚拟流动性
  setHolders: (holders) => set(() => ({ holders })),
}))
