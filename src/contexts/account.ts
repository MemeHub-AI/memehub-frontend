import { ReactNode, createContext, createElement, useContext } from 'react'

import type { UserMyInfoRes } from '@/api/user/types'
import { PartialPick } from '@/utils/types'

interface ContextValue {
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

const AccountContext = createContext<ContextValue | null>(null)

export const AccountProvider = ({
  children,
  ...value
}: { children: ReactNode } & ContextValue) => {
  return createElement(AccountContext.Provider, { value }, children)
}

export const useAccountContext = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('`AccountProvider` is not found')
  }

  return context
}
