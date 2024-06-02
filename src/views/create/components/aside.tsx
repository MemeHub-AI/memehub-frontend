import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomSuspense } from '@/components/custom-suspense'
import { NewsCard } from '@/components/news'
import { useNewsList } from '@/hooks/use-news-list'
import { NewsSkeleton } from '@/components/news/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStorage } from '@/hooks/use-storage'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { utilLang } from '@/utils/lang'
import { cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'

interface Props extends ComponentProps<'div'> {
  newsListData: ReturnType<typeof useNewsList>
  aIMemeInfo: ReturnType<typeof useAIMemeInfo>
  tab: number
  setTab: (tab: number) => void
}

export const InspirationNews = ({
  className,
  newsListData,
  aIMemeInfo,
  tab: tabIdx,
  setTab,
}: Props) => {
  const { t } = useTranslation()
  const { getArea, setArea } = useStorage()
  const { push } = useRouter()

  const {
    getAIMemeInfo,
    isLoadingMemeImg,
    isLoadingMemeInfo,
    isLoadingMemePoster,
  } = aIMemeInfo

  const {
    isFetching,
    newsList,
    countryList,
    show,
    memeit,
    fetchNextPage,
    fetchPreviousPage,
    setShow,
    handleClick,
  } = newsListData

  const tabs = [t('next.moonshot'), t('hot-opportunity')]

  const hidden = () => {
    setShow(false)
  }

  const onChange = (value: string) => {
    setArea(value)
    newsListData.setArea(+value)
  }

  const onChangeTab = (idx: number) => {
    setTab(idx)
  }

  const onConfirm = async () => {
    await getAIMemeInfo(newsListData.memeit?.title!)
    hidden()
  }

  return (
    <div className={className}>
      <div className="flex items-start">
        {tabs.map((tab, i) => {
          return (
            <div
              key={i}
              className={cn(
                'px-2.5 py-1.5 text-nowrap rounded-xl my-5 cursor-pointer border-2 border-transparent',
                'hover:border-black',
                i === 1 && 'ml-3',
                tabIdx == i && 'bg-black text-[#ffe770]'
              )}
              onClick={() => onChangeTab(i)}
            >
              {tab}
            </div>
          )
        })}
      </div>
      {tabIdx === 0 ? (
        <Select defaultValue={getArea()} onValueChange={onChange}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <SelectValue placeholder={t('area')} />
          </SelectTrigger>
          <SelectContent>
            {countryList?.map((country, i) => (
              <SelectItem key={i} value={`${country.id}`}>
                {utilLang.getContent(country.name)}
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
            <NewsCard
              news={news!}
              key={i}
              onClick={() => {
                push(`${Routes.Idea}/${news?.id}`)
              }}
              onMeme={() => {
                handleClick(news)
              }}
            />
          ))}
        </div>
        {/* <Pagination
          total={tradeRecords.length}
          onPageChange={() => fetch({})}
        ></Pagination> */}
      </CustomSuspense>

      <AICreateMemecoinDialog
        show={show}
        loading={isLoadingMemeInfo}
        data={{
          name: memeit?.title,
          image: memeit?.image,
          description: memeit?.content,
        }}
        hidden={hidden}
        onConfirm={onConfirm}
      ></AICreateMemecoinDialog>
    </div>
  )
}
