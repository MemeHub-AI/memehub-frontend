import { create } from 'zustand'

import type { UserInfoRes } from '@/api/user/types'

interface UserStore {
  userInfo: UserInfoRes | null

  setUserInfo: (userInfo: UserInfoRes) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,

  setUserInfo: (userInfo) => set({ userInfo }),
}))
