import { create } from 'zustand'

import { AIMemeInfo } from '@/api/ai/type'

interface AIMemeInfoStore {
  info?: AIMemeInfo | null

  setInfo: (userInfo: AIMemeInfo) => void
}

export const useAimemeInfoStore = create<AIMemeInfoStore>((set, get) => ({
  info: null,

  setInfo: (info) => set({ info }),
}))
