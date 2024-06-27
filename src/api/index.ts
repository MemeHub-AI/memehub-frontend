import { useFetch } from '@/hooks/use-fetch'

export const api = useFetch('https://demo-api.memehub.ai')
export const morkaApi = useFetch(
  'http://127.0.0.1:4523/m2/4488723-4135432-default'
)
