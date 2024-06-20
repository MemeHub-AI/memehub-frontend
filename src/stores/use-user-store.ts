import { create } from 'zustand'
import { isEmpty } from 'lodash'

import type { UserInfoRes } from '@/api/user/types'
import type { IdentityList } from '@/api/alliance/type'

interface UserStore {
  userInfo: UserInfoRes | null
  userIdentity: IdentityList | null

  setUserInfo: (userInfo: UserInfoRes | null) => void
  setUserIdentity: (id: IdentityList) => void
  hasIdentity: () => boolean
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  userIdentity: null,

  setUserInfo: (userInfo) => set({ userInfo }),
  setUserIdentity: (userIdentity) => set({ userIdentity }),
  hasIdentity: () => {
    const { kol = false, community = [] } = get().userIdentity || {}
    return kol && !isEmpty(community)
  },
}))
