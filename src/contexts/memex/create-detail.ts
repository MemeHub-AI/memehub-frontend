import { createContext, useContext } from 'react'

import { useCreateIdeaDetails } from '../../views/memex/create/details/hooks/use-create-idea-details'
import { CONTEXT_ERR } from './../../errors/context'

interface Value extends ReturnType<typeof useCreateIdeaDetails> {}

const Context = createContext<Value | null>(null)

export const CreateIdeaDetailsProvider = Context.Provider

export const useCreateIdeaDetailsContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('CreateIdeaDetailsProvider')
  return context
}
