import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from './../../errors/context'
import { usePostDetails } from '@/views/memex/post/hooks/use-post-details'
import { useCommentList } from '@/views/memex/post/hooks/use-comment-list'

interface Value
  extends ReturnType<typeof usePostDetails>,
    ReturnType<typeof useCommentList> {}

const Context = createContext<Value | null>(null)

export const PostDetailsProvider = Context.Provider

export const usePostDetailsContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('PostDetailProvider')
  return context
}
