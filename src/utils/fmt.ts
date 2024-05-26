import { BigNumber } from 'bignumber.js'
import { isEmpty } from 'lodash'

interface FmtAddrOptions {
  len?: number
  separator?: string
}

interface FmtProgressOptions {
  toFixed?: number
}

export const fmt = {
  addr: (address?: string, options?: FmtAddrOptions) => {
    if (!address || !address.trim()) return ''
    const { len = 4, separator = '...' } = options || {}

    return `${address.slice(0, len)}${separator}${address.slice(-len)}`
  },
  progress: (value?: number, options?: FmtProgressOptions) => {
    const { toFixed } = options || {}
    let percent = value

    if (typeof value === 'undefined') {
      percent = 0
    }

    const result = toFixed ? percent?.toFixed(toFixed) : percent
    return `${result}%`
  },
  toAnchor(value?: string | number) {
    const val = (value?.toString() || '').trim()

    if (isEmpty(val)) return '#'
    return `#${val}`
  },
  tradeFixed(n: BigNumber | number) {
    n = typeof n === 'number' ? BigNumber(n) : n
    return n.toFixed(n.lt(1) ? 6 : 2)
  },
  percent: (value: string | number | undefined, fixed = 2) => {
    if (!value) return '0%'

    const percent = BigNumber(value).multipliedBy(100).toFixed(fixed)
    return fmt.progress(Number(percent))
  },
}
