import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  hideClaimed: boolean
}

const Context = createContext<Value | null>(null)

export const AirdropProvider = Context.Provider

export const useAirdropContext = () => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw CONTEXT_ERR.notFound('AirdropProvider')
  }

  return ctx
}
