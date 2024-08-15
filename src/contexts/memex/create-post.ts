import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { useCreateIdea } from '@/views/memex/create/hooks/use-create-idea'

interface Value extends ReturnType<typeof useCreateIdea> {}

const Context = createContext<Value | null>(null)

export const CreateIdeaProvider = Context.Provider

export const useCreateIdeaContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('CreateIdeaProvider')
  return context
}
