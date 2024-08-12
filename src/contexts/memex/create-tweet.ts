import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { useCreateTweet } from '@/views/memex/create/hooks/use-create-tweet'

interface Value extends ReturnType<typeof useCreateTweet> {}

const Context = createContext<Value | null>(null)

export const CreateTweetProvider = Context.Provider

export const useCreateTweetContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('CreateTweetProvider')
  return context
}
