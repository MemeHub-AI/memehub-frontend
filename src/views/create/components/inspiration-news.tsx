import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { CustomSuspense } from '@/components/custom-suspense'
import { NewsCard } from '@/components/news'
import { useNewsList } from '@/hooks/use-news-list'
import { NewsSkeleton } from '@/components/news/skeleton'
import clsx from 'clsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const InspirationNews = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [selectTab, setSelectTab] = useState(0)

  const { newsList, handleClick, isFetching } = useNewsList()

  const tabs = [t('next.moonshot'), t('hot.opportunity')]

  const areas = ['美国', '中国']

  const onChange = () => {
    console.log('change')
  }

  const onChangeTab = (idx: number) => {
    setSelectTab(idx)
  }

  return (
    <div className={className}>
      <div className="flex items-start">
        {tabs.map((tab, i) => {
          return (
            <div
              key={i}
              className={clsx(
                'tab-item',
                selectTab === i ? 'active' : '',
                i !== 0 ? '!ml-6' : ''
              )}
              onClick={() => onChangeTab(i)}
            >
              {tab}
            </div>
          )
        })}
      </div>
      <Select onValueChange={onChange}>
        <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
          <SelectValue placeholder={t('area')} />
        </SelectTrigger>
        <SelectContent>
          {areas.map((name, i) => (
            <SelectItem key={i} value={String(i)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CustomSuspense
        isPending={isFetching}
        list={newsList}
        fallback={<NewsSkeleton />}
        className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip"
      >
        <div className="flex flex-col gap-3">
          {newsList?.map((news, i) => (
            <NewsCard news={news!} key={i} onMeme={() => handleClick(news)} />
          ))}
        </div>
      </CustomSuspense>
    </div>
  )
}
