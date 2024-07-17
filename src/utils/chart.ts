import { Bar } from '../../public/js/charting_library/datafeed-api'

/** `1m` => `1` */
export const parseInterval = (interval?: string) => {
  if (!interval || !interval.trim()) return '1'
  // TradingView's `minutes` do not have `m`
  if (interval.endsWith('m')) return interval.replace('m', '')
  if (interval === '1h') return '60'
  if (interval === '4h') return '240'

  return interval
}

/** `1` => `1m` */
export const formatInterval = (tvInterval?: string, lower = true) => {
  if (!tvInterval || !tvInterval.trim()) return '1m'
  const num = Number(tvInterval)
  if (num < 60) return `${tvInterval}m`
  if (num === 60) return '1h'
  if (num === 240) return '4h'

  return lower ? tvInterval.toLowerCase() : tvInterval
}

type BarLike = Omit<Bar, 'time'> & { timestamp: number }

/** `BarLike[]` => `Bar[]` */
export const parseBars = (bars: BarLike[]) => {
  return bars.filter(Boolean).map((bar) => {
    const barTimeLen = bar.timestamp.toString().length
    const time = barTimeLen !== 13 ? bar.timestamp * 1000 : bar.timestamp

    return {
      ...bar,
      time: Math.floor(time),
      volume: Number(bar.volume),
    } as Bar
  })
}

/**
 * `0.001` => `1000`
 *
 * `0.0001` => `10000`
 **/
export const parsePricescale = (price?: number) => {
  if (!price) return 100

  const decimal = price.toString().split('.')[1]
  const decimalLen = decimal?.length ?? 0
  if (decimalLen <= 2) return 100

  const pricescale = '1'.padEnd(decimalLen + 1, '0')
  return Number(pricescale)
}
