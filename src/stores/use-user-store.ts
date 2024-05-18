import { create } from 'zustand'

interface UserStore {
  token: string | null

  setToken: (token: string) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  token: null,

  setToken: (token) => set({ token }),
}))
