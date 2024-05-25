import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { CustomSuspense } from '@/components/custom-suspense'
import { NewsCard } from '@/components/news'
import { NewsSkeleton } from '@/components/news/skeleton'

import { useNewsList } from '@/hooks/use-news-list'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const HotNewsAside = () => {
  const { t } = useTranslation()

  const { data, handleClick, hidden, isFetching, show, loading, newsList } =
    useNewsList()

  return (
    <aside className="w-aside max-sm:hidden border-r pt-3">
      <h2 className="text-red-500 text-xl font-bold mb-4">
        {t('hot-opportunity')}
      </h2>
      <CustomSuspense
        isPending={isFetching}
        fallback={<NewsSkeleton />}
        list={newsList}
      >
        <div className="flex flex-col gap-3">
          {newsList?.map((news, i) => (
            <NewsCard news={news!} key={i} onMeme={() => handleClick(news)} />
          ))}
        </div>
      </CustomSuspense>
      <AICreateMemecoinDialog
        data={data}
        show={show}
        loading={loading}
        hidden={hidden}
      />
    </aside>
  )
}

export default HotNewsAside
