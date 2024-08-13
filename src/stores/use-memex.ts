import { create } from 'zustand'
import { z } from 'zod'

import type { MemexCreateReq } from '@/api/memex/types'
import { marketingSchema } from '@/components/marketing-field'

type TweetRequired = Pick<MemexCreateReq, 'content' | 'chain' | 'image_urls'>

type TweetOptional = Omit<MemexCreateReq, 'content' | 'chain' | 'image_urls'> &
  z.infer<typeof marketingSchema>

interface MemexStore {
  tweet: TweetRequired | null
  tweetDetails: TweetOptional | null

  setTweet: (tweet: MemexStore['tweet']) => void
  setTweetDetails: (details: MemexStore['tweetDetails']) => void
}

export const useMemexStore = create<MemexStore>((set) => ({
  tweet: null,
  tweetDetails: null,

  setTweet: (tweet) => set({ tweet }),
  setTweetDetails: (tweetDetails) => set({ tweetDetails }),
}))
