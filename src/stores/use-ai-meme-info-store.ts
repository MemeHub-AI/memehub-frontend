import { create } from 'zustand'

import { AIMemeInfo } from '@/api/ai/type'

interface AIMemeInfoStore {
  info?: AIMemeInfo | null
  formInfo?: AIMemeInfo | null
  setInfo: (userInfo?: AIMemeInfo) => void
  setFormInfo: (formInfo?: AIMemeInfo) => void
}

export const useAimemeInfoStore = create<AIMemeInfoStore>((set, get) => ({
  info: null,
  setInfo: (info) => set({ info }),
  setFormInfo: (formInfo) => set({ formInfo }),
}))
