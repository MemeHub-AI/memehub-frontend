import { first, isEmpty } from 'lodash'

import { mediaLinks } from '@/config/link'

export const strToBool = (str: string | undefined | null) => {
  if (!str) return false

  return str === 'true' ? true : false
}

export const lowerIncludes = (a: string) => {
  const lowerA = a.toLowerCase()
  return (b: string) => {
    const lowerB = b.toLowerCase()
    return lowerA.includes(lowerB)
  }
}

export const joinPaths = (...args: (string | number)[]) => {
  if (isEmpty(args)) return ''

  const firstHasSlash = first(args)?.toString().startsWith('/')
  const path = args.map((a) => String(a).replace(/^\/|\/$/g, '')).join('/')

  return firstHasSlash ? `/${path}` : path
}

export const parseMediaUrl = (media: keyof typeof mediaLinks, value = '') => {
  if (value) {
    if (value.startsWith('@')) {
      value = value.replace('@', '')
    }
    return /^(https|http):\/\//.test(value) ? value : `${media}${value}`
  }
  return value
}
