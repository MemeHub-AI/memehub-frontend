import { Network } from '@/constants/contract'

export interface ChainData {
  id: string
  network: Network
  name: string
  displayName: string
  native: {
    decimals: number
    name: string
    symbol: string
  }
  is_supported: boolean
  logo: string
}
