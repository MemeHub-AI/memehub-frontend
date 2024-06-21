import { ProviderProps, createContext, createElement, useContext } from 'react'

import { useCreateTokenForm } from '@/views/create/hooks/use-form'
import { useDeploy } from '@/views/create/hooks/use-deploy'
import { useNewsList } from '@/hooks/use-news-list'

interface Value {
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeploy>
  newsListData: ReturnType<typeof useNewsList>
}

const Context = createContext<Value | null>(null)

export const CreateTokenProvider = Context.Provider

export const useCreateTokenContext = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('Cannot find `CreateTokenProvider`')
  }

  return context
}
