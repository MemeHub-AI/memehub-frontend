import { createContext } from 'react'
import { useCreateTokenForm } from './hooks/use-form'
import { useDeployV1 } from './hooks/use-deploy-v1'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'

export const CreateTokenContext = createContext<{
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeployV1>
  newsListData: ReturnType<typeof useNewsList>
  aiMemeInfo: ReturnType<typeof useAIMemeInfo>
}>({
  formData: {} as ReturnType<typeof useCreateTokenForm>,
  deployResult: {} as ReturnType<typeof useDeployV1>,
  newsListData: {} as ReturnType<typeof useNewsList>,
  aiMemeInfo: {} as ReturnType<typeof useAIMemeInfo>,
})
