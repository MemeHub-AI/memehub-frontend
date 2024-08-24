import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface Props {
  isLoading?: boolean
  hasMore?: boolean
  onFetchMore?: () => void
}

const baseClass = 'text-center text-zinc-500'

export const LoadMore = ({
  className,
  children,
  isLoading,
  hasMore,
  onFetchMore,
  ...props
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()

  if (!hasMore) {
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
