import { create } from 'zustand'

import { AIMemeInfo } from '@/api/ai/type'

interface AIMemeInfoStore {
  info?: AIMemeInfo
  formInfo?: AIMemeInfo
  loadingInfoDialog: boolean // show Dialog
  loadingLogo: boolean //   Loading MEME logo
  loadingPoster: boolean // Loading MEME poster
  loadingInfo: boolean // Loading MEME info
  loadingImg: boolean //  Loading MEME all image
  loadingDesc: boolean //  Loading MEME description
  setInfo: (userInfo?: AIMemeInfo) => void
  setFormInfo: (formInfo?: AIMemeInfo) => void
  setLoadingInfo: (loading: boolean) => void
  setLoadingDesc: (loading: boolean) => void
  setLoadingImg: (loading: boolean) => void
  setLoadingLogo: (loadingLogo: boolean) => void
  setLoadingPoster: (loadingPoster: boolean) => void
  setLoadingInfoDialog: (loadingInfoDialog: boolean) => void
}

export const useAimemeInfoStore = create<AIMemeInfoStore>((set, get) => ({
  info: undefined,
  loadingInfoDialog: false,
  loadingInfo: false,
  loadingImg: false,
  loadingLogo: false,
  loadingPoster: false,
  loadingDesc: false,
  setInfo: (info) => set({ info }),
  setLoadingInfo: (loadingInfo) => set({ loadingInfo }),
  setLoadingDesc: (loadingDesc) => set({ loadingDesc }),
  setLoadingImg: (loadingImg) => set({ loadingImg }),
  setFormInfo: (formInfo) => set({ formInfo }),
  setLoadingLogo: (loadingLogo) => set({ loadingLogo }),
  setLoadingPoster: (loadingPoster) => set({ loadingPoster }),
  setLoadingInfoDialog: (loadingInfoDialog) => set({ loadingInfoDialog }),
}))
