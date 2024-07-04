import { BigNumber } from 'bignumber.js'
import { first, isEmpty } from 'lodash'

interface FmtAddrOptions {
  len?: number
  separator?: string
  preLen?: number
  sufLen?: number
}

interface FmtProgressOptions {
  toFixed?: number
}

interface DecimalsOptions {
  fixed?: number
  round?: boolean
}

export const fmt = {
  addr: (address?: string, options?: FmtAddrOptions) => {
    if (!address || !address.trim()) return ''
    const { len = 4, separator = '...', preLen, sufLen } = options || {}
    const prefix = address.slice(0, preLen ?? len)
    const suffix = address.slice(-(sufLen ?? len))

    return `${prefix}${separator}${suffix}`
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
  decimals(value?: number | string | BigNumber, options?: DecimalsOptions) {
    const { fixed = 2, round = false } = options ?? {}
    if (!value) return '0'

    const roundMode = round ? BigNumber.ROUND_HALF_UP : BigNumber.ROUND_DOWN
    value = value instanceof BigNumber ? value : BigNumber(value)

    if (value.gte(1)) {
      return value.toFixed(fixed, roundMode)
    }
    if (value.lte(0)) return '0'

    const decimalIndex = value.toFixed(roundMode).indexOf('.')
    if (decimalIndex !== -1) {
      const decimalPart = value.toFixed(roundMode).slice(decimalIndex + 1)
      const zeroLen = decimalPart.match(/^0*/)?.[0].length ?? 0
      const lastNumbers = decimalPart.replace(/^0+/, '')
      const slicedLastNum = lastNumbers.slice(0, fixed)
      const result = `0.0{${zeroLen}}${slicedLastNum}`

      if (zeroLen < 2) return value.toFixed(fixed, roundMode)
      if (zeroLen === 2) return value.toFixed(fixed + 1, roundMode)

      return result
    } else {
      return BigNumber(value).toFixed(roundMode)
    }
  },
  replaceHTMLCode(content: string) {
    const reg = /&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;/g
    const map = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
    } as Record<string, string>

    return content.replaceAll(reg, (match) => {
      return map[match] as string
    })
  },
}
