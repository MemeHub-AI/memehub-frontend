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
import { useStorage } from '@/hooks/use-storage'

interface Props extends ComponentProps<'div'> {
  newsListData: ReturnType<typeof useNewsList>
}

export const InspirationNews = ({ className, newsListData }: Props) => {
  const { t } = useTranslation()
  const [selectTab, setSelectTab] = useState(0)
  const { getArea, setArea } = useStorage()

  const { isFetching, newsList, countryList, handleClick } = newsListData

  const tabs = [t('next.moonshot'), t('hot-opportunity')]

  const onChange = (value: string) => {
    setArea(value)
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
                'tab-item text-nowrap',
                selectTab === i ? 'active' : '',
                i !== 0 ? '!ml-4' : ''
              )}
              onClick={() => onChangeTab(i)}
            >
              {tab}
            </div>
          )
        })}
      </div>
      {selectTab === 0 ? (
        <Select defaultValue={getArea() || 'US'} onValueChange={onChange}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <SelectValue placeholder={t('area')} />
          </SelectTrigger>
          <SelectContent>
            {countryList?.map((country, i) => (
              <SelectItem key={i} value={country.short_name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      <CustomSuspense
        isPending={isFetching}
        fallback={<NewsSkeleton />}
        nullback={t('no.data')}
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
