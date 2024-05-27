import { create } from 'zustand'

import type { UserInfoRes } from '@/api/user/types'

interface UserStore {
  userInfo: UserInfoRes | null

  setUserInfo: (userInfo: UserInfoRes) => void
  isFollowed: (id: string) => boolean
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,

  setUserInfo: (userInfo) => set({ userInfo }),
  isFollowed: (id) => {
    // TODO: implementation here.
    return false
    const follow = get().userInfo?.following.find((f) => f.id === Number(id))
    return !!follow
  },
}))
