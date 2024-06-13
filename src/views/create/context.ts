import { createContext } from 'react'
import { useCreateTokenForm } from './hooks/use-form'
import { useDeployV1 } from './hooks/use-deploy-v1'
import { useNewsList } from '@/hooks/use-news-list'

export const CreateTokenContext = createContext<{
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeployV1>
}>({
  formData: {} as ReturnType<typeof useCreateTokenForm>,
  deployResult: {} as ReturnType<typeof useDeployV1>,
})
