import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  isBuy: boolean
  isTraded: boolean
  reserveBalance: string
  tokenBalance: string
  value: string
  disabled: boolean
}

const TradeContext = createContext<Value | null>(null)

export const TradeTabsProvider = TradeContext.Provider

export const useTradeTabsContext = () => {
  const ctx = useContext(TradeContext)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('TradeProvider')
  }

  return ctx
}
