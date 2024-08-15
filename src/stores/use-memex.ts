import { create } from 'zustand'
import { z } from 'zod'

import type { MemexCreateReq } from '@/api/memex/types'
import { marketingSchema } from '@/components/marketing-field'

type PostRequired = Pick<
  MemexCreateReq,
  'content' | 'chain' | 'image_urls' | 'factory_address'
>

type PostOptional = Omit<
  MemexCreateReq,
  'content' | 'chain' | 'image_urls' | 'factory_address'
> &
  z.infer<typeof marketingSchema>

interface MemexStore {
  post: PostRequired | null
  postDetails: PostOptional | null

  setPost: (post: MemexStore['post']) => void
  setPostDetails: (postDetails: MemexStore['postDetails']) => void
}

export const useMemexStore = create<MemexStore>((set) => ({
  post: null,
  postDetails: null,

  setPost: (post) => set({ post }),
  setPostDetails: (postDetails) => set({ postDetails }),
}))
