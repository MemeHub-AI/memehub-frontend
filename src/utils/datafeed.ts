import { datafeedUnit } from '@/config/datafeed'

export const withPair = (symbol: string) => {
  if (datafeedUnit === 'master') return symbol
  return `${symbol}/${datafeedUnit.toUpperCase()}`
}
