import { createContext, useContext } from 'react'

import { ERR } from '@/errors'
import { UserListType } from '@/api/user/types'

interface Value {
  tab: UserListType
  refetchFollows: () => void
}

const Context = createContext<Value | null>(null)

export const FollowTabProvider = Context.Provider

export const useFollowTabContext = () => {
  const ctx = useContext(Context)

  if (!ctx) throw ERR.notFound('FollowTabProvider')
  return ctx
}
