import { useFetch } from '@/hooks/use-fetch'

export const api = useFetch(process.env.NEXT_PUBLIC_API_URL!)
