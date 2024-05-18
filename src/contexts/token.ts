import { createContext, createElement, useContext, type ReactNode } from 'react'

interface ContextValue {
  total: string
  current: string
  refetchInfo: Function
}

const TokenContext = createContext<ContextValue | null>(null)

export const TokenProvider = ({
  children,
  ...value
}: { children: ReactNode } & ContextValue) => {
  return createElement(TokenContext.Provider, { value }, children)
}

export const useTokenContext = () => {
  const context = useContext(TokenContext)

  if (!context) throw new Error('`TokenProvider` not found')
  return context
}
