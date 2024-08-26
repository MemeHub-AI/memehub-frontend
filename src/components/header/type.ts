import { TokenCreate, TokenTrade } from '@/views/token/hooks/use-token-ws/types'

export interface ShakeCardProps<T extends TokenCreate | TokenTrade> {
  trade: T
  className?: string
  textClass?: string
  imageClass?: string
  color: string
}
