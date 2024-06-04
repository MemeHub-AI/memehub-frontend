import {
  createContext,
  createElement,
  useContext,
  type ProviderProps,
} from 'react'

import { ERR } from '@/errors'

interface Value {
  isBuy: boolean
  isSell: boolean
  isTraded: boolean
  nativeSymbol: string
  nativeBalance: string
  tokenBalance: string
}

const TradeContext = createContext<Value | null>(null)

export const TradeProvider = ({ children, value }: ProviderProps<Value>) => {
  return createElement(TradeContext.Provider, { value }, children)
}

export const useTradeContext = () => {
  const context = useContext(TradeContext)

  if (!context) {
    throw ERR.notFound(TradeProvider.name)
  }

  return context
}
