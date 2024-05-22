import { create } from 'zustand'

import type { UserMyInfoRes } from '@/api/user/types'

interface UserStore {
  userInfo: UserMyInfoRes | null

  setUserInfo: (userInfo: UserMyInfoRes) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,

  setUserInfo: (userInfo) => set({ userInfo }),
}))
