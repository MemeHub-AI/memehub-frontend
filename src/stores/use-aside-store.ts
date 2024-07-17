import { create } from 'zustand'

interface AsideStore {
  tab: number

  setTab: (tab: number) => void
}

export const useAsideStore = create<AsideStore>((set) => ({
  tab: 1,

  setTab: (tab) => set({ tab }),
}))
