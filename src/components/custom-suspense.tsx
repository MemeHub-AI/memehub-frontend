import React, { type ComponentProps, createElement } from 'react'
import { isEmpty } from 'lodash'

interface Props extends ComponentProps<'div'> {
  isPending?: boolean
  fallback: React.ReactNode
  nullback?: React.ReactNode
  container?: keyof React.ReactDOM | 'fragment'
}

// TODO: pass `className` to the root element.
export const CustomSuspense = (props: Props) => {
  const {
    isPending,
    fallback,
    nullback,
    children,
    container = 'div',
    ...restProps
  } = props

  if (isPending) return createElement(container, restProps, fallback)
  if (nullback && isEmpty(React.Children.toArray(children))) return nullback
  if (container === 'fragment') return <>{children}</>

  return createElement(container, restProps, children)
}

export default CustomSuspense
