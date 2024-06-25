import {
  type ProviderProps,
  createContext,
  createElement,
  useContext,
} from 'react'

import type { TokenListItem } from '@/api/token/types'

import { ERR } from '@/errors'

interface Value {
  tokenInfo: TokenListItem | undefined
  isLoadingTokenInfo: boolean
  isFetchingTokenInfo: boolean
  refetchInfo: Function
}

const TokenContext = createContext<Value | null>(null)

export const TokenProvider = TokenContext.Provider

export const useTokenContext = () => {
  const context = useContext(TokenContext)

  if (!context) {
    throw ERR.notFound(TokenProvider.name)
  }

  return context
}
