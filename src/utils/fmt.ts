import { BigNumber } from 'bignumber.js'
import { t } from 'i18next'
import { isEmpty } from 'lodash'

import { utilLang } from './lang'

interface FmtAddrOptions {
  len?: number
  separator?: string
  preLen?: number
  sufLen?: number
}

interface DecimalsOptions {
  fixed?: number
  round?: boolean
}

interface PercentOptions {
  fixed?: number
  label?: string
}

export const fmt = {
  addr: (address?: string, options?: FmtAddrOptions) => {
    if (!address || !address.trim()) return ''
    const { len = 4, separator = '...', preLen, sufLen } = options || {}
    const prefix = address.slice(0, preLen ?? len)
    const suffix = address.slice(-(sufLen ?? len))

    return `${prefix}${separator}${suffix}`
  },
  toAnchor: (value?: string | number) => {
    const val = (value?.toString() || '').trim()

    if (isEmpty(val)) return '#'
    return `#${val}`
  },
  percent: (
    value: string | number | undefined,
    { fixed = 2, label = '%' }: PercentOptions = {}
  ) => {
    if (!value) return 0 + label

    const isFractional = value.toString().includes('.')
    if (!isFractional) return BigNumber(value).toFixed(fixed) + label

    const percent = BigNumber(value).multipliedBy(100).toFixed(fixed)
    return percent + label
  },
  decimals: (
    value?: number | string | BigNumber,
    options?: DecimalsOptions
  ) => {
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
      const decimalPart = value.toFixed().slice(decimalIndex + 1)
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
  replaceHTMLCode: (content: string) => {
    const reg = /&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;/g
    const map = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
    } as Record<string, string>

    return content.replace(reg, (match) => {
      return map[match] as string
    })
  },
  withChain: (value: string | undefined) => {
    if (!value) return ''

    const chain = t('chain')
    if (value.endsWith(chain)) return value

    return `${value} ${chain}`
  },
  withCommunity: (str: string | undefined) => {
    if (!str) return ''

    const lower = str.toLowerCase()
    const cmnt = t('pure.community')
    if (lower.endsWith(cmnt.toLowerCase())) return str

    return utilLang.isEn() ? `${str} ${cmnt}` : str + cmnt
  },
  fileName: (name: string | undefined, len = 10, endLen = 6) => {
    if (!name) return ''

    if (name.length > len) {
      return name.slice(0, len) + '...' + name.slice(-endLen)
    } else {
      return name
    }
  },
  ellipsis: (str: string | undefined, max = 7) => {
    if (!str) return ''

    if (str.length > max) {
      return str.slice(0, max) + '...'
    } else {
      return str
    }
  },
}
