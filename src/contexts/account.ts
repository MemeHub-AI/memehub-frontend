import { createContext, useContext } from 'react'

import type { UserInfoRes } from '@/api/user/types'
import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  userInfo: UserInfoRes | undefined
  isPending: boolean
  isOtherUser: boolean
  refetchUserInfo: VoidFunction
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
