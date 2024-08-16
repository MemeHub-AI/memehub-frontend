import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '../../errors/context'
import { useIdeaDetails } from '@/views/memex/idea/hooks/use-idea-details'
import { useCommentList } from '@/views/memex/idea/hooks/use-comment-list'
import { useIdeaInfo } from '@/views/memex/hooks/use-idea-info'

interface Value
  extends ReturnType<typeof useIdeaDetails>,
    ReturnType<typeof useCommentList>,
    ReturnType<typeof useIdeaInfo> {}

const Context = createContext<Value | null>(null)

export const IdeaDetailsProvider = Context.Provider

export const useIdeaDetailsContext = () => {
  const context = useContext(Context)

  if (!context) throw CONTEXT_ERR.notFound('IdeaDetailsProvider')
  return context
}
