import { createContext, useContext } from 'react'
import { type Address } from 'viem'

import { useTokenInfo } from './../views/token/hooks/use-token-info'
import { CONTEXT_ERR } from '@/errors/context'
import { Network } from '@/enums/contract'
import { ChainData } from '@/api/chain/type'
import { useTokenWs } from '@/views/token/hooks/use-token-ws'

interface Context
  extends Omit<ReturnType<typeof useTokenInfo>, 'isRefetchingTokenInfo'>,
    ReturnType<typeof useTokenWs> {
  // TOOD/top: remove all `isIdoToken` condition, because it's also `isGraduated`.
  isIdoToken: boolean
  isGraduated: boolean
  reserveSymbol: string | undefined
  chainId: number
  chainName: string
  tokenAddr: Address
  network: Network
  tokenChain: ChainData | undefined
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
