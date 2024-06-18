import React, { type ComponentProps, createElement, forwardRef } from 'react'
import { isEmpty } from 'lodash'

interface Props extends ComponentProps<'div'> {
  isPending?: boolean
  fallback: React.ReactNode
  nullback?: React.ReactNode
  container?: keyof React.ReactDOM | 'fragment'
}

export const CustomSuspense = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      isPending,
      fallback,
      nullback,
      children,
      container = 'div',
      ...restProps
    } = props

    if (isPending)
      return createElement(container, { ...restProps, ref }, fallback)
    if (nullback && isEmpty(React.Children.toArray(children))) return nullback
    if (container === 'fragment') return <>{children}</>

    return createElement(container, { ...restProps, ref }, children)
  }
)

export default CustomSuspense
