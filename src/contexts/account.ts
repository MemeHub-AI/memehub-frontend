import { createContext, useContext } from 'react'

import type { UserInfoRes } from '@/api/user/types'

import { CONTEXT_ERR } from '@/errors/context'
import { VoidFn } from '@/utils/types'

interface Value {
  userInfo: UserInfoRes | undefined
  isPending: boolean
  isOtherUser: boolean
  refetchUserInfo: VoidFn
}

const AccountContext = createContext<Value | null>(null)

export const AccountProvider = AccountContext.Provider

export const useAccountContext = () => {
  const ctx = useContext(AccountContext)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('AccountProvider')
  }

  return ctx
}
