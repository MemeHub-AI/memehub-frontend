import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { UserListType } from '@/api/user/types'

interface Value {
  tab: UserListType
  refetchFollows: () => void
}

const Context = createContext<Value | null>(null)

export const FollowTabProvider = Context.Provider

export const useFollowTabContext = () => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('FollowTabProvider')
  }

  return ctx
}
