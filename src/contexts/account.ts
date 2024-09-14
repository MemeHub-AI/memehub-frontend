import { createContext, useContext } from 'react'

import type { UserInfoRes } from '@/api/user/types'
import { CONTEXT_ERR } from '@/errors/context'
import { useUserList } from '@/views/account/hooks/use-user-list'
import { MemexIdeaItem } from '@/api/memex/types'
import { useIdeaList } from '@/views/memex/hooks/use-idea-list'

interface Value {
  userInfo: UserInfoRes | undefined
  isPending: boolean
  isOtherUser: boolean
  refetchUserInfo: VoidFunction
  publishIdeas: ReturnType<typeof useIdeaList>
  followersResults: ReturnType<typeof useUserList>
  followingResults: ReturnType<typeof useUserList>
  refetchFollow: () => void
}

const AccountContext = createContext<Value | null>(null)

export const AccountProvider = AccountContext.Provider

export const useAccountContext = () => {
  const context = useContext(AccountContext)
  if (!context) {
    throw CONTEXT_ERR.notFound('AccountProvider')
  }

  return context
}
