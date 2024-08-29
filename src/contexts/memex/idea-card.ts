import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { IdoInfo } from '@/views/memex/hooks/use-ido-infos'
import { MemexIdeaItem } from '@/api/memex/types'

interface Value {
  idea: MemexIdeaItem | undefined
  ideaInfo: IdoInfo | undefined
}

const Context = createContext<Value | null>(null)

export const IdeaCardProvider = Context.Provider

export const useIdeaCardContext = () => {
  const context = useContext(Context)
  if (!context) throw CONTEXT_ERR.notFound('IdeaCardProvider')
  return context
}
