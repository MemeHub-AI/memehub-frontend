import { createContext, useContext } from 'react'

import { ERR } from '@/errors'

interface Value {
  hideClaimed: boolean
}

const Context = createContext<Value | null>(null)

export const AirdropProvider = Context.Provider

export const useAirdropContext = () => {
  const ctx = useContext(Context)

  if (!ctx) throw ERR.notFound('AirdropProvider')
  return ctx
}
