import { create } from 'zustand'

interface CommentsStore {
  refetchComments: (() => void) | null
  setRefetchComments: (refetch: () => void) => void
}

export const useCommentsStore = create<CommentsStore>((set) => ({
  refetchComments: null,
  setRefetchComments: (refetchComments) => set({ refetchComments }),
}))
