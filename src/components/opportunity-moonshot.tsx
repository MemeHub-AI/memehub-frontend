import React, { type ComponentProps } from 'react'
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
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { utilLang } from '@/utils/lang'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { Button } from './ui/button'
import { DrawerTrigger, DrawerContent, Drawer } from './ui/drawer'

interface Props extends ComponentProps<'div'> {
  newsListData?: ReturnType<typeof useNewsList>
  tab: number
  listClassName?: string
  isDialogLoading?: boolean
  setTab: (tab: number) => void
  onConfirmDialog: () => void
}

export const OpportunityMoonshot = ({
  className,
  listClassName,
  newsListData,
  tab: tabIdx,
  isDialogLoading,
  setTab,
  onConfirmDialog,
}: Props) => {
  const { t } = useTranslation()
  const { getArea, setArea } = useStorage()
  const { push } = useRouter()

  const {
    isFetching,
    newsList,
    loadingCountry,
    countryList,
    show,
    memeit,
    setShow,
    handleClick,
    fetchPreviousPage,
    fetchNextPage,
  } = newsListData || {}

  if (countryList) {
    const usIdx = countryList?.findIndex((country) => country.id === 24) || 0
    const country = countryList.splice(usIdx, 1)?.[0]
    if (country) countryList?.unshift(country)
  }

  const tabs = [t('next.moonshot'), t('take.wave')]

  const hidden = () => {
    setShow?.(false)
  }

  const onChange = (value: string) => {
    setArea(value)
    newsListData?.setArea(+value)
  }

  const onChangeTab = (idx: number) => {
    setTab(idx)
  }

  const onConfirm = async () => {
    onConfirmDialog()
    hidden()
  }

  return (
    <div
      className={clsx(
        'mr-10 pr-10 border-r-2 border-black min-h-[100vh] max-sm:mr-0 max-sm:pr-0  max-sm:h-min max-sm:border-0',
        className
      )}
    >
      <div className="hidden h-[98vh]"></div>
      <div
        className={clsx(
          'sticky top-[65px] ml-6 w-aside max-md:ml-0 max-md:px-4 max-md:order-2 max-md:w-[480px] max-sm:w-full',
          tabIdx === 1 ? 'h-[90vh]' : 'h-[92vh]'
        )}
      >
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
            {loadingCountry ? (
              <Button className="mb-4 w-[inheirt] max-sm:mb-2">
                {t('loading.country')}
              </Button>
            ) : (
              <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
                <SelectValue placeholder={t('area')} />
              </SelectTrigger>
            )}
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
          className={clsx(
            'flex flex-col gap-6  overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip',
            tabIdx === 1 ? 'h-[calc(100vh-160px)]' : 'h-[calc(100vh-210px)]',
            listClassName
          )}
        >
          <div className="flex flex-col gap-3">
            {newsList?.map((news, i) => (
              <NewsCard
                news={news!}
                key={i}
                onClick={() => {
                  push(`${Routes.Idea}/${news?.id}?type=${tabIdx + 1}`)
                }}
                onMeme={() => {
                  handleClick?.(news)
                }}
              />
            ))}
          </div>
        </CustomSuspense>

        <AICreateMemecoinDialog
          show={show}
          loading={isDialogLoading}
          data={{
            name: memeit?.title,
            image: memeit?.image,
            description: memeit?.content,
          }}
          hidden={hidden}
          onConfirm={onConfirm}
        ></AICreateMemecoinDialog>
      </div>
    </div>
  )
}

export const MobileQpportunityMoonshot = ({
  newsListData,
  tab: tabIdx,
  setTab,
  children,
}: Props) => {
  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <OpportunityMoonshot
          className="relative"
          listClassName={clsx(
            '!overflow-y-auto',
            tabIdx == 0 ? 'max-sm:h-[65vh]' : 'max-sm:h-[70vh]'
          )}
          newsListData={newsListData}
          isDialogLoading={false}
          onConfirmDialog={() => {}}
          tab={tabIdx}
          setTab={setTab}
        />
      </DrawerContent>
    </Drawer>
  )
}
