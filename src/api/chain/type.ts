export interface ChainData {
  id: string
  name: string
  logo: string
  is_supported: boolean
  contract_address: string
  native: {
    decimals: number
    name: string
    symbol: string
  }
  explorer: string
}
