import { create } from 'zustand'

import type { MemexCreateReq } from '@/api/memex/types'

type IdeaRequired = Pick<MemexCreateReq, 'content' | 'chain' | 'image_urls'>

type IdeaOptional = Omit<
  MemexCreateReq,
  | 'content'
  | 'chain'
  | 'image_urls'
  | 'factory_address'
  | 'airdrop_address'
  | 'coin_factory_address'
> & {
  initialBuyAmount: string
}

interface MemexStore {
  idea: IdeaRequired | null
  ideaDetails: IdeaOptional | null

  setIdea: (idea: MemexStore['idea']) => void
  setIdeaDetails: (ideaDetails: MemexStore['ideaDetails']) => void
}

export const useMemexStore = create<MemexStore>((set) => ({
  idea: null,
  ideaDetails: null,

  setIdea: (idea) => set({ idea }),
  setIdeaDetails: (ideaDetails) => set({ ideaDetails }),
}))
