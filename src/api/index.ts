import { useFetch } from '@/hooks/use-fetch'

export const api = useFetch(process.env.NEXT_PUBLIC_API_URL!)
export const morkaApi = useFetch(
  'http://127.0.0.1:4523/m1/4488723-4135432-default'
)
