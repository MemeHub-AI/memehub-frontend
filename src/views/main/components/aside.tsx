import React from 'react'
import { useTranslation } from 'react-i18next'

import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { CustomSuspense } from '@/components/custom-suspense'
import { NewsCard } from '@/components/news'
import { NewsSkeleton } from '@/components/news/skeleton'
import { useNewsList } from '@/hooks/use-news-list'

export const HotNewsAside = () => {
  const { t } = useTranslation()

  const { memeit, handleClick, hidden, isFetching, show, loading, newsList } =
    useNewsList()

  return (
    <aside className="w-aside max-sm:hidden border-r pt-3">
      <h2 className="text-red-500 text-xl font-bold mb-4">
        {t('hot-opportunity')}
      </h2>
      <CustomSuspense
        isPending={isFetching}
        fallback={<NewsSkeleton />}
        nullback={<>{t('no.data')}</>}
        className="flex flex-col gap-3 pr-5"
      >
        {newsList?.map((news, i) => (
          <NewsCard news={news!} key={i} onMeme={() => handleClick(news)} />
        ))}
      </CustomSuspense>
      <AICreateMemecoinDialog
        data={{
          name: memeit?.title.query,
          image: memeit?.articles[0].image.imageUrl,
          description: memeit?.articles[0].snippet,
        }}
        show={show}
        loading={loading}
        hidden={hidden}
        onConfirm={() => {}}
      />
    </aside>
  )
}

export default HotNewsAside
