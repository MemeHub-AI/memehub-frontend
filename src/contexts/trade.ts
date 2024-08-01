import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  isBuy: boolean
  isSell: boolean
  isTraded: boolean
  nativeBalance: string
  tokenBalance: string
}

const TradeContext = createContext<Value | null>(null)

export const TradeProvider = TradeContext.Provider

export const useTradeContext = () => {
  const ctx = useContext(TradeContext)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('TradeProvider')
  }

  return ctx
}
