import {
  type ProviderProps,
  createContext,
  createElement,
  useContext,
} from 'react'

import type { TokenListItem } from '@/api/token/types'

import { ERR } from '@/errors'

interface Value {
  total: string
  current: string
  refetchInfo: Function
  tokenInfo: TokenListItem | undefined
}

const TokenContext = createContext<Value | null>(null)

export const TokenProvider = ({ children, value }: ProviderProps<Value>) => {
  return createElement(TokenContext.Provider, { value }, children)
}

export const useTokenContext = () => {
  const context = useContext(TokenContext)

  if (!context) {
    throw ERR.notFound(TokenProvider.name)
  }

  return context
}
