import { BigNumber } from 'bignumber.js'
import { first, isEmpty } from 'lodash'

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
  percent: (value: string | number | undefined, fixed = 2) => {
    if (!value) return '0%'

    const percent = BigNumber(value).multipliedBy(100).toFixed(fixed)
    return fmt.progress(Number(percent))
  },
  firstUpperCase(s?: string) {
    if (!s) return ''
    return s.replace(s[0], s[0].toUpperCase())
  },
  toHref(...args: string[]) {
    // Adapt ends with '/' for the first arg.
    const firstStr = first(args) || ''
    if (firstStr.endsWith('/')) {
      args.splice(0, 1, firstStr.slice(0, -1))
    }

    return args.join('/')
  },
  decimals(value?: number | string | BigNumber, fixed = 2) {
    if (!value) return '0'

    value = value instanceof BigNumber ? value : BigNumber(value)
    if (value.gte(1)) return value.toFixed(fixed)
    if (value.lte(0)) return '0'

    const decimalIndex = value.toFixed().indexOf('.')
    if (decimalIndex !== -1) {
      const decimalPart = value.toFixed().slice(decimalIndex + 1)
      const zeroLen = decimalPart.match(/^0*/)?.[0].length ?? 0
      const lastNumbers = decimalPart.replace(/^0+/, '')
      const slicedLastNum = lastNumbers.slice(0, fixed)
      const result = `0.0{${zeroLen}}${slicedLastNum}`

      if (zeroLen < 2) return value.toFixed(fixed)
      if (zeroLen === 2) return value.toFixed(++fixed)

      return result
    } else {
      return BigNumber(value).toFixed()
    }
  },
}
