import { create } from 'zustand'
import { useCreateDetailForm } from '@/views/memex/create/hooks/use-detail-form'

interface MemexDetailStore {
  formData: ReturnType<typeof useCreateDetailForm> | null
  setFormData: (form: ReturnType<typeof useCreateDetailForm>) => void
}
export const useMemexDetailStore = create<MemexDetailStore>((set, get) => ({
  formData: null,

  setFormData: (form) => set({ formData: form }),
}))
