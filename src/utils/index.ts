import { first, isEmpty, sortBy } from 'lodash'

import { mediaLinks } from '@/config/link'
import { ObjectLike } from './types'

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
  const path = args
    .map((a) => String(a).replace(/^\/|\/$/g, ''))
    .filter(Boolean)
    .join('/')

  return firstHasSlash ? `/${path}` : path
}

export const parseMediaUrl = (media: keyof typeof mediaLinks, url = '') => {
  if (isEmpty(url) || media === 'gitbook') return url
  if (media !== 'website') {
    url = url.replace('@', '')
  }

  return /^https?:\/\//.test(url) ? url : `${mediaLinks[media]}${url}`
}

// TODO/low: type safe
export const sortVersions = <T>(
  inputs: string[] | ObjectLike<T>,
  order: 'asc' | 'desc' = 'desc'
) => {
  inputs = Array.isArray(inputs) ? inputs : Object.keys(inputs)
  const versions = sortBy(inputs, (v) => v.split('.').map((v) => +v), order)

  return order === 'desc' ? versions.reverse() : versions
}
