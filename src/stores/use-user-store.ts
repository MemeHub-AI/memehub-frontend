import { create } from 'zustand'

import type { UserInfoRes } from '@/api/user/types'
import type { CommunityListItem } from '@/api/alliance/type'

interface UserStore {
  userInfo: UserInfoRes | null
  oldUserInfo: UserInfoRes | null

  isKol: boolean
  hasCommunity: boolean
  /** Is also `userInfo` */
  kolInfo: UserInfoRes | null
  communityInfo: CommunityListItem | null

  setUserInfo: (userInfo: UserStore['userInfo']) => void
  setIsKol: (value: boolean) => void
  setHasCommunity: (value: boolean) => void
  setKolInfo: (kolInfo: UserStore['kolInfo']) => void
  setCommunityInfo: (communityInfo: UserStore['communityInfo']) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  oldUserInfo: null,
  isKol: false,
  hasCommunity: false,
  kolInfo: null,
  communityInfo: null,

  setUserInfo: (userInfo) => set({ userInfo, oldUserInfo: get().userInfo }),
  setIsKol: (isKol) => set({ isKol }),
  setHasCommunity: (hasCommunity) => set({ hasCommunity }),
  setKolInfo: (kolInfo) => set({ kolInfo }),
  setCommunityInfo: (communityInfo) => set({ communityInfo }),
}))
