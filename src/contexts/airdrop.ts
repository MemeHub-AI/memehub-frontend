import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  shouldHideClaimed: boolean
}

const Context = createContext<Value | null>(null)

export const AirdropProvider = Context.Provider

export const useAirdropContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw CONTEXT_ERR.notFound('AirdropProvider')
  }

  return context
}
