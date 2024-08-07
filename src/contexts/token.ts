import { createContext, useContext } from 'react'
import { type Address } from 'viem'

import { useTokenInfo } from './../views/token/hooks/use-token-info'
import { CONTEXT_ERR } from '@/errors/context'
import { Network } from '@/enums/contract'

interface Context
  extends Omit<ReturnType<typeof useTokenInfo>, 'isRefetchingTokenInfo'> {
  isIdoToken: boolean
  isGraduated: boolean
  reserveSymbol: string | undefined
  chainId: number
  chainName: string
  tokenAddr: Address
  network: Network
}

const TokenContext = createContext<Context | null>(null)

export const TokenProvider = TokenContext.Provider

export const useTokenContext = () => {
  const ctx = useContext(TokenContext)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('TokenProvider')
  }

  return ctx
}
