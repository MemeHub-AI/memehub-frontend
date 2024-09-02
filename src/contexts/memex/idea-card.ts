import { createContext, useContext } from 'react'

import { CONTEXT_ERR } from '@/errors/context'
import { IdoInfo } from '@/views/memex/hooks/use-ido-infos'
import { MemexIdeaItem } from '@/api/memex/types'
import { useIdeaStatus } from '@/views/memex/hooks/use-idea-status'
import { ChainData } from '@/api/chain/type'

interface Value {
  idea: MemexIdeaItem | undefined
  ideaInfo: IdoInfo | undefined
  ideaStatus: ReturnType<typeof useIdeaStatus>
  isList: boolean
  isDetails: boolean
  isMyIdeas: boolean
  isNonPay: boolean
  chain: ChainData | undefined
  chainId: number
  startAt: number
  endAt: number
  duration: number
  likeValue: string
  ownerPercent: string
  userClaimAmount: string
  refetchInfo: VoidFunction
}

const Context = createContext<Value | null>(null)

export const IdeaCardProvider = Context.Provider

export const useIdeaCardContext = () => {
  const context = useContext(Context)
  if (!context) throw CONTEXT_ERR.notFound('IdeaCardProvider')
  return context
}
