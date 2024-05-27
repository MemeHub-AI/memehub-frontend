import type { Bar } from '../../../../public/charting_library/charting_library'

type BarItem = {
  timestamp: number
  open: number
  close: number
  high: number
  low: number
  volume: number
  [k: string]: any
}

export const useCandlestickParse = () => {
  const toTradingViewInterval = (interval?: string) => {
    if (!interval || !interval.trim()) return '1'
    // TradingView's `minutes` do not have `m`
    if (interval.endsWith('m')) return interval.replace('m', '')
    if (interval === '1h') return '60'
    if (interval === '4h') return '240'

    return interval
  }

  const parseTradingViewInterval = (tvInterval?: string) => {
    if (!tvInterval || !tvInterval.trim()) return '1m'
    const num = Number(tvInterval)
    if (num < 60) return `${tvInterval}m`
    if (num === 60) return '1h'
    if (num === 240) return '4h'

    return tvInterval.toLowerCase()
  }

  const toBars = (list: BarItem[]) => {
    return list.filter(Boolean).map((item) => {
      return {
        ...item,
        time: item.timestamp * 1000,
      } as Bar
    })
  }

  return {
    toTradingViewInterval,
    parseTradingViewInterval,
    toBars,
  }
}
