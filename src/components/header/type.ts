import {
  TokenWsCreate,
  TokenWsTrade,
} from '@/views/token/hooks/use-token-ws/types'

export interface ShakeCardProps<T extends TokenWsCreate | TokenWsTrade> {
  trade: T
  className?: string
  textClass?: string
  imageClass?: string
  color: string
}
