import { create } from 'zustand'

interface HeaderStore {
  diamondEl: HTMLImageElement | null

  setDiamondEl: (el: HTMLImageElement) => void
}

export const useHeaderStore = create<HeaderStore>((set, get) => ({
  diamondEl: null,

  setDiamondEl: (diamondEl) => set({ diamondEl }),
}))
