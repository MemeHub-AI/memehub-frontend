import React, { type ComponentProps, createElement } from 'react'
import { isEmpty } from 'lodash'

interface Props extends ComponentProps<'div'> {
  isPending: boolean
  fallback: React.ReactNode
  nullback?: React.ReactNode
  container?: keyof React.ReactDOM | 'fragment'
}

export const CustomSuspense = (props: Props) => {
  const {
    isPending,
    fallback,
    nullback,
    children,
    container = 'fragment',
    ...resetProps
  } = props

  if (isPending) return fallback
  if (nullback && isEmpty(children)) return nullback
  if (container === 'fragment') return <>{children}</>

  return createElement(container, resetProps, children)
}

export default CustomSuspense
