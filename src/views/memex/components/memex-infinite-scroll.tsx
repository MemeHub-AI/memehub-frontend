import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'

import { memexBodyId } from './memex-tabs'

export const MemexInfiniteScroll = <T,>({
  list,
  total,
  children,
  fetchNext,
}: {
  list: T[]
  total: number
  children: ReactNode
  fetchNext: () => void
}) => {
  const { t } = useTranslation()

  return (
    <InfiniteScroll
      dataLength={list.length}
      next={fetchNext}
      hasMore={list.length < total}
      scrollableTarget={memexBodyId}
      loader={<p className="text-center text-zinc-500 mt-2">{t('loading')}</p>}
      endMessage={
        <p className="text-center text-zinc-500 mt-2">{t('no-more')}</p>
      }
    >
      {children}
    </InfiniteScroll>
  )
}

export default MemexInfiniteScroll
