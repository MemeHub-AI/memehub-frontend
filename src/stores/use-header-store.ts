import { create } from 'zustand'

interface HeaderStore {
  rewardButtonEl: HTMLButtonElement | null

  setRewardButtonEl: (el: HTMLButtonElement) => void
}

export const useHeaderStore = create<HeaderStore>((set, get) => ({
  rewardButtonEl: null,

  setRewardButtonEl: (el) => set({ rewardButtonEl: el }),
}))
