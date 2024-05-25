import {
  type ProviderProps,
  createContext,
  createElement,
  useContext,
} from 'react'

import type { UserInfoRes } from '@/api/user/types'

import { ERR } from '@/errors'

interface Value {
  userInfo: UserInfoRes | undefined
  isPending: boolean
  isOtherUser: boolean
  refetchUserInfo: Function
}

const AccountContext = createContext<Value | null>(null)

export const AccountProvider = ({ children, value }: ProviderProps<Value>) => {
  return createElement(AccountContext.Provider, { value }, children)
}

export const useAccountContext = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw ERR.notFound(AccountProvider.name)
  }

  return context
}
