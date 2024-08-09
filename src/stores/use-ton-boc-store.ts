import { create } from 'zustand'

interface TonBocStore {
  hashBoc: string

  setHashBoc: (hashBoc: string) => void
}

export const useTonBocStore = create<TonBocStore>((set) => ({
  hashBoc: '',

  setHashBoc: (hashBoc: string) => set({ hashBoc }),
}))
