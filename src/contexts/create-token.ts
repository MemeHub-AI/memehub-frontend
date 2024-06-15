import { ProviderProps, createContext, createElement, useContext } from 'react'

import { useCreateTokenForm } from '@/views/create/hooks/use-form'
import { useDeployV2 } from '@/views/create/hooks/use-deploy-v2'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'

interface Value {
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeployV2>
  newsListData: ReturnType<typeof useNewsList>
  aiMemeInfo: ReturnType<typeof useAIMemeInfo>
}

const Context = createContext<Value | null>(null)

export const CreateTokenProvider = ({
  children,
  ...props
}: ProviderProps<Value>) => {
  return createElement(Context.Provider, props, children)
}

export const useCreateTokenContext = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('Cannot find `CreateTokenProvider`')
  }

  return context
}
