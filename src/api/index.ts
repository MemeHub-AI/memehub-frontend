import { apiUrl } from '@/config/url'
import { useFetch } from '@/hooks/use-fetch'

export const api = useFetch(apiUrl.memehub)
