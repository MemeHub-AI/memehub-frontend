import {
  type ProviderProps,
  createContext,
  createElement,
  useContext,
} from 'react'

import type { UserMyInfoRes } from '@/api/user/types'
import type { PartialPick } from '@/utils/types'

interface Value {
  userInfo:
    | PartialPick<
        UserMyInfoRes,
        'coins_created' | 'replies' | 'notifications' | 'coins_held'
      >
    | null
    | undefined
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
    throw new Error('`AccountProvider` is not found.')
  }

  return context
}
