import { create } from 'zustand'

interface WalletStore {
  connectOpen: boolean

  setConnectOpen: (open: boolean) => void
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  connectOpen: false,

  setConnectOpen: (open) => set({ connectOpen: open }),
}))
