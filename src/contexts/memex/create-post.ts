import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { useCreatePost } from '@/views/memex/create/hooks/use-create-post'

interface Value extends ReturnType<typeof useCreatePost> {}

const Context = createContext<Value | null>(null)

export const CreatePostProvider = Context.Provider

export const useCreatePostContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('CreateTweetProvider')
  return context
}
