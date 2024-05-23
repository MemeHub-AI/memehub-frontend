import {
  createContext,
  createElement,
  useContext,
  type ProviderProps,
} from 'react'

interface Value {
  isBuy: boolean
  isSell: boolean
  symbol: string
  ethBalance: string
  tokenBalance: string
}

const TradeContext = createContext<Value | null>(null)

export const TradeProvider = ({ children, value }: ProviderProps<Value>) => {
  return createElement(TradeContext.Provider, { value }, children)
}

export const useTradeContext = () => {
  const context = useContext(TradeContext)

  if (!context) {
    throw new Error('`TradeProvider` is not found.')
  }

  return context
}
