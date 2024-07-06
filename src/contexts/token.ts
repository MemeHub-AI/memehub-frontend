import { useTokenInfo } from './../views/token/hooks/use-token-info'
import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'

type Context = Omit<ReturnType<typeof useTokenInfo>, 'isRefetchingTokenInfo'>

const TokenContext = createContext<Context | null>(null)

export const TokenProvider = TokenContext.Provider

export const useTokenContext = () => {
  const ctx = useContext(TokenContext)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('TokenProvider')
  }

  return ctx
}
