import { useCreateDetailForm } from '@/views/memex/create/hooks/use-detail-form'
import { createContext, useContext } from 'react'

interface Value {
  formData: ReturnType<typeof useCreateDetailForm>
}

const Context = createContext<Value | null>(null)

export const CreateDetailProvider = Context.Provider

export const useCreateDetailContext = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('Cannot find `CreateTokenProvider`')
  }

  return context
}
