import { create } from 'zustand'

import { AIMemeInfo } from '@/api/ai/type'

interface AIMemeInfoStore {
  info?: AIMemeInfo
  formInfo?: AIMemeInfo
  loadingLogo: boolean
  loadingPoster: boolean
  loading: boolean
  setInfo: (userInfo?: AIMemeInfo) => void
  setFormInfo: (formInfo?: AIMemeInfo) => void
  setLoading: (loading: boolean) => void
  setLoadingLogo: (loadingLogo: boolean) => void
  setLoadingPoster: (loadingPoster: boolean) => void
}

export const useAimemeInfoStore = create<AIMemeInfoStore>((set, get) => ({
  info: undefined,
  loading: false,
  loadingLogo: false,
  loadingPoster: false,
  setInfo: (info) => set({ info }),
  setLoading: (loading) => set({ loading }),
  setFormInfo: (formInfo) => set({ formInfo }),
  setLoadingLogo: (loadingLogo) => set({ loadingLogo }),
  setLoadingPoster: (loadingPoster) => set({ loadingPoster }),
}))
