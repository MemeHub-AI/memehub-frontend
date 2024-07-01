import { createContext, useContext } from 'react'

import type { TokenListItem } from '@/api/token/types'

import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  tokenInfo: TokenListItem | undefined
  isLoadingTokenInfo: boolean
  isFetchingTokenInfo: boolean
  refetchInfo: Function
}

const TokenContext = createContext<Value | null>(null)

export const TokenProvider = TokenContext.Provider

export const useTokenContext = () => {
  const ctx = useContext(TokenContext)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('TokenProvider')
  }

  return ctx
}
