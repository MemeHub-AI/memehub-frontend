import { create } from 'zustand'

import type { UserMyInfoRes } from '@/api/user/types'

interface UserStore {
  userInfo: UserMyInfoRes | null

  setUserInfo: (userInfo: UserMyInfoRes) => void
  isFollowed: (id: string) => boolean
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,

  setUserInfo: (userInfo) => set({ userInfo }),
  isFollowed: (id) => {
    const follow = get().userInfo?.following.find((f) => f.id === Number(id))
    return !!follow
  },
}))
