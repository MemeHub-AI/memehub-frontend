import { create } from 'zustand'
import { isEmpty } from 'lodash'

import type { UserInfoRes } from '@/api/user/types'
import type { IdentityList } from '@/api/airdrop/types'

type Refetcher = (...args: any[]) => Promise<any>

interface UserStore {
  userInfo: UserInfoRes | null
  userIdentity: IdentityList | null
  refetchUserInfo: Refetcher | null

  setUserInfo: (userInfo: UserInfoRes | null) => void
  setUserIdentity: (id: IdentityList) => void
  hasIdentity: () => boolean
  setRefetchUserInfo: (refetchUserInfo: Refetcher) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  userIdentity: null,
  refetchUserInfo: null,

  setUserInfo: (userInfo) => set({ userInfo }),
  setUserIdentity: (userIdentity) => set({ userIdentity }),
  hasIdentity: () => {
    const { kol = false, community = [] } = get().userIdentity || {}
    return kol && !isEmpty(community)
  },
  setRefetchUserInfo: (refetchUserInfo) => set({ refetchUserInfo }),
}))
