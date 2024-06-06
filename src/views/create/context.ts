import { createContext } from 'react'
import { useCreateTokenForm } from './hooks/use-form'
import { useDeploy } from './hooks/use-deploy'
import { useNewsList } from '@/hooks/use-news-list'

export const CreateTokenContext = createContext<{
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeploy>
}>({
  formData: {} as ReturnType<typeof useCreateTokenForm>,
  deployResult: {} as ReturnType<typeof useDeploy>,
})
