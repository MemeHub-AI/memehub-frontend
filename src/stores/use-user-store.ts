import { create } from 'zustand'
import { isEmpty } from 'lodash'

import type { UserInfoRes } from '@/api/user/types'
import type { IdentityList } from '@/api/airdrop/types'

interface UserStore {
  userInfo: UserInfoRes | null
  oldUserInfo: UserInfoRes | null
  userIdentity: IdentityList | null

  setUserInfo: (userInfo: UserInfoRes | null) => void
  setUserIdentity: (id: IdentityList) => void
  hasIdentity: () => boolean
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  oldUserInfo: null,
  userIdentity: null,
  refetchUserInfo: null,

  setUserInfo: (userInfo) => {
    set({ userInfo, oldUserInfo: get().userInfo })
  },
  setUserIdentity: (userIdentity) => set({ userIdentity }),
  hasIdentity: () => {
    const { kol = false, community = [] } = get().userIdentity || {}
    return !!kol || !isEmpty(community)
  },
}))
