import { useMemexDetailStore } from '@/stores/use-memex-create'
import { useCreateForm } from './use-form'
import { useState } from 'react'

export const useCreateStore = () => {
  const [isFirst, setIsFirst] = useState(true)
  const { setDetailFormData, setMainFormData, setHandleConfirm } =
    useMemexDetailStore()
  const {
    mainForm: fakeMainForm,
    detailForm: fakeDetailForm,
    handleConfirm: fakeHandleConfirm,
  } = useCreateForm()
  if (isFirst) {
    console.log('set')

    setDetailFormData(fakeDetailForm)
    setMainFormData(fakeMainForm)
    setHandleConfirm(fakeHandleConfirm)
    setIsFirst(false)
  }
}
