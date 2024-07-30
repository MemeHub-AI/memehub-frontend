import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'

interface Value extends ReturnType<typeof useIdoInfo> {
  isExpired: boolean
  chainId: number
  reserveSymbol: string
  poolId: number
}

const Context = createContext<Value | null>(null)

export const IdoProvider = Context.Provider

export const useIdoContext = () => {
  const context = useContext(Context)
  if (!context) throw CONTEXT_ERR.notFound('IdoProvider')

  return context
}
