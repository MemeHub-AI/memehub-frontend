import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'

import { Title } from './title'
import { newsApi } from '@/api/news'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export const InspirationNews = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { data: result, isFetching } = useQuery({
    queryKey: [newsApi.getNews.name],
    queryFn: newsApi.getNews,
  })

  return (
    <div className={className}>
      <div className="flex items-center gap-6">
        <Button variant="secondary" size="icon" onClick={router.back}>
          <ArrowLeftIcon />
        </Button>
        <Title className="whitespace-nowrap">
          {t('create.inspiration.title')}
        </Title>
      </div>
      <CustomSuspense
        isPending={isFetching}
        fallback={<NewsSkeleton />}
        className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip"
      >
        {result?.map((item, i) => (
          <div
            key={i}
            className="flex rounded-2xl cursor-pointer"
            onClick={() => open(item.articles[0]?.image?.newsUrl)}
          >
            <div className="relative rounded-b-lg min-w-[90px] min-h-[90px]  overflow-hidden">
              <img
                src={item.articles[0]?.image?.imageUrl}
                className="w-[90px] h-[90px] rounded-lg cursor-pointer"
                alt=""
              />
            </div>
            <div className="py-0 pr-2 ml-3 flex flex-col justify-between">
              <h1 className="text-2xl  cursor-pointer hover:text-gray-500 max-sm:text-xl leading-none">
                {item.title?.query}
              </h1>
              <div className="max-sm:mt-1 max-md:max-w-[65vw] line-clamp-2 text-zinc-500">
                {item.articles[0]?.title}
              </div>
            </div>
          </div>
        ))}
      </CustomSuspense>
    </div>
  )
}

const NewsSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-2 w-full">
          <Skeleton className="h-[90px] w-[90px] rounded-lg" />
          <div className="flex flex-col justify-between flex-1">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
