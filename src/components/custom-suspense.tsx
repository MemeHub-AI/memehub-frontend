import React, { type ComponentProps, createElement } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

interface Props extends ComponentProps<'div'> {
  isPending: boolean
  list?: any[]
  fallback: React.ReactNode
  nullback?: React.ReactNode
  container?: keyof React.ReactDOM | 'fragment'
}

export const CustomSuspense = (props: Props) => {
  const {
    isPending,
    fallback,
    nullback,
    list,
    children,
    container = 'div',
    ...resetProps
  } = props

  const { t } = useTranslation()

  if (isPending) return fallback
  if (nullback && isEmpty(children)) return nullback
  if (container === 'fragment') return <>{children}</>
  if (!list?.length) return <>{t('no.data')}</>

  return createElement(container, resetProps, children)
}

export default CustomSuspense
