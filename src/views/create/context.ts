import { createContext } from 'react'
import { useCreateTokenForm } from './hooks/use-form'
import { useDeploy } from './hooks/use-deploy'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'

export const CreateTokenContext = createContext<{
  formData?: ReturnType<typeof useCreateTokenForm>
  deployResult?: ReturnType<typeof useDeploy>
  newsListData?: ReturnType<typeof useNewsList>
  aiMemeInfo?: ReturnType<typeof useAIMemeInfo>
}>({})
