import { createContext, useContext } from 'react'

import { useCreateDetail } from './../../views/memex/create/detail/hooks/use-create-detail'
import { CONTEXT_ERR } from './../../errors/context'

interface Value extends ReturnType<typeof useCreateDetail> {}

const Context = createContext<Value | null>(null)

export const CreateDetailProvider = Context.Provider

export const useCreateDetailContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('CreateDetailProvider')
  return context
}
