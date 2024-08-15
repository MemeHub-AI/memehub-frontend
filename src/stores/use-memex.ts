import { create } from 'zustand'
import { z } from 'zod'

import type { MemexCreateReq } from '@/api/memex/types'
import { marketingSchema } from '@/components/marketing-field'

type IdeaRequired = Pick<MemexCreateReq, 'content' | 'chain' | 'image_urls'>

type IdeaOptional = Omit<
  MemexCreateReq,
  'content' | 'chain' | 'image_urls' | 'factory_address'
> &
  z.infer<typeof marketingSchema>

interface MemexStore {
  idea: IdeaRequired | null
  ideaDetails: IdeaOptional | null

  setIdea: (post: MemexStore['idea']) => void
  setIdeaDetails: (postDetails: MemexStore['ideaDetails']) => void
}

export const useMemexStore = create<MemexStore>((set) => ({
  idea: null,
  ideaDetails: null,

  setIdea: (idea) => set({ idea }),
  setIdeaDetails: (ideaDetails) => set({ ideaDetails }),
}))
