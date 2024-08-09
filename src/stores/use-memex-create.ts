import { create } from 'zustand'
import { useCreateForm } from '@/views/memex/create/hooks/use-form'

interface MemexDetailStore {
  detailFormData: ReturnType<typeof useCreateForm>['detailForm'] | null
  setDetailFormData: (
    form: ReturnType<typeof useCreateForm>['detailForm']
  ) => void
  mainFormData: ReturnType<typeof useCreateForm>['mainForm'] | null
  setMainFormData: (form: ReturnType<typeof useCreateForm>['mainForm']) => void
  handleConfirm: ReturnType<typeof useCreateForm>['handleConfirm'] | null
  setHandleConfirm: (
    fn: ReturnType<typeof useCreateForm>['handleConfirm']
  ) => void
}
export const useMemexDetailStore = create<MemexDetailStore>((set, get) => ({
  detailFormData: null,
  setDetailFormData: (form) => set({ detailFormData: form }),
  mainFormData: null,
  setMainFormData: (form) => set({ mainFormData: form }),
  handleConfirm: null,
  setHandleConfirm: (fn) => set({ handleConfirm: fn }),
}))
