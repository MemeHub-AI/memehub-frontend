import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface Props<T> extends ComponentProps<'div'> {
  list: T[]
  total: number
  isLoading?: boolean
  onFetchMore?: () => void
}

const baseClass = 'text-center text-zinc-500'

export const LoadMore = <T,>({
  className,
  children,
  list,
  total,
  isLoading,
  onFetchMore,
  ...props
}: Props<T>) => {
  const { t } = useTranslation()
  const isEmpty = list.length === 0 || total === 0

  if (list.length >= total || isEmpty) {
    return (
      <div className={cn(baseClass, className)} {...props}>
        {t('nomore')}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn(baseClass, className)} {...props}>
        {t('loading')}
      </div>
    )
  }

  return (
    <div
      className={cn(
        '!text-blue-600 sm:hover:underline active:underline cursor-pointer',
        baseClass,
        className
      )}
      onClick={onFetchMore}
      {...props}
    >
      {t('load-more')}
    </div>
  )
}

export default LoadMore
