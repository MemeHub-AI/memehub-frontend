import React, { useEffect, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { clsx } from 'clsx'
import { useQuery } from '@tanstack/react-query'

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
import { utilLang } from '@/utils/lang'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Button } from './ui/button'
import { DrawerTrigger, DrawerContent, Drawer } from './ui/drawer'
import { newsApi } from '@/api/news'
import { useAsideStore } from '@/stores/use-aside-store'
import { replace } from 'lodash'
import { useResponsive } from '@/hooks/use-responsive'

interface Props extends ComponentProps<'div'> {
  defalutTab?: string | string[] | number
  listClassName?: string
  containerClass?: string
}

enum Tab {
  Moonshot,
  Classic,
}

const containerClassName = `flex flex-col gap-3 max-md:gap-4 max-md:overflow-y-clip  overflow-y-auto`

export const OpportunityMoonshot = (props: Props) => {
  const { defalutTab = 1, className, listClassName, containerClass } = props
  const storage = useStorage()
  const { t } = useTranslation()
  const { push, replace, query, ...router } = useRouter()
  const { tab, setTab } = useAsideStore()
  const { isPad } = useResponsive()

  const { data: countryList, isLoading: loadingCountry } = useQuery({
    queryKey: [newsApi.getCountry.name],
    queryFn: newsApi.getCountry,
  })

  const { isLoading, isFetching, newsList, setArea, ref } = useNewsList({
    isOpportunity: false,
  })

  const {
    isLoading: opportunityListLoading,
    isFetching: opportunityListFetching,
    newsList: opportunityList,
    ref: opportunityRef,
  } = useNewsList({
    isOpportunity: true,
  })

  if (countryList?.data) {
    const usIdx =
      countryList?.data?.findIndex((country) => country.id === 24) || 0
    const country = countryList?.data.splice(usIdx, 1)?.[0]
    if (country) countryList?.data?.unshift(country)
  }

  const tabs = [t('next.moonshot'), t('classic.meme')]

  const onChange = (value: string) => {
    storage.setArea(value)
    setArea(+value)
  }

  const onChangeTab = (idx: number) => {
    setTab(idx)
    
    if(isPad) {
      if(idx === 0) 
        push(Routes.Moonshot)
      else if(idx === 1)
        push(Routes.ClassicMeme)
    }
  }

  useEffect(() => {
    if(!defalutTab) return
    if (defalutTab === '1') {
      setTab(Tab.Moonshot)
    } else if (defalutTab === '2') {
      setTab(Tab.Classic)
    }
  }, [defalutTab])

  return (
    <div
      className={clsx(
        'pr-2 border-r-2 border-black min-h-body max-sm:mr-0 max-sm:pr-0  max-sm:h-min max-sm:border-0',
        className
      )}
    >
      <div className="hidden h-[98vh]"></div>
      <div
        className={clsx(
          'sticky top-[65px] ml-6 w-aside max-md:ml-0 max-md:px-4 max-md:order-2 max-md:w-full',
          tab === Tab.Classic ? 'h-[90vh]' : 'h-[92vh]',
          containerClass
        )}
      >
        <div className="flex items-start">
          {tabs.map((t, i) => {
            return (
              <div
                key={i}
                className={cn(
                  'px-2.5 py-1.5 text-nowrap rounded-xl my-5 cursor-pointer border-2 border-transparent',
                  'hover:border-black select-none',
                  i === Tab.Classic && 'ml-3',
                  tab === i && 'bg-black text-[#ffe770]'
                )}
                onClick={() => onChangeTab(i)}
              >
                {t}
              </div>
            )
          })}
        </div>
        {tab === Tab.Moonshot ? (
          <Select defaultValue={storage.getArea()} onValueChange={onChange}>
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
              {countryList?.data?.map((country, i) => (
                <SelectItem key={i} value={`${country.id}`}>
                  {utilLang.getContent(country.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <CustomSuspense
          ref={ref}
          isPending={isLoading}
          fallback={<NewsSkeleton />}
          nullback={tab === Tab.Moonshot ? <Nullback /> : null}
          className={clsx(
            containerClassName,
            tab === 1 ? 'h-[calc(100vh-160px)]' : 'h-[calc(100vh-210px)]',
            tab === 1 && 'hidden',
            listClassName
          )}
        >
          {newsList?.map((news, i) => (
            <NewsCard
              news={news!}
              key={i}
              onClick={() => {
                push(`${Routes.Idea}/${news?.id}?type=${tab + 1}`)
              }}
            />
          ))}
          {isFetching && tab === 0 ? (
            <div className="text-center my-5">{t('loading')}</div>
          ) : null}
        </CustomSuspense>

        <CustomSuspense
          ref={opportunityRef}
          isPending={opportunityListLoading}
          fallback={<NewsSkeleton />}
          nullback={tab === Tab.Classic ? <Nullback /> : null}
          className={clsx(
            containerClassName,
            tab === Tab.Classic
              ? 'h-[calc(100vh-160px)]'
              : 'h-[calc(100vh-210px)]',
            tab === Tab.Moonshot ? 'hidden' : '',
            listClassName
          )}
        >
          {opportunityList?.map((news, i) => (
            <NewsCard
              news={news!}
              key={i}
              onClick={() => {
                if (router.pathname.startsWith(Routes.Idea)) {
                  replace(
                    `${Routes.Idea}/${news?.id}?type=${tab === 1 ? 3 : 1}`
                  )
                } else {
                  push(`${Routes.Idea}/${news?.id}?type=${tab === 1 ? 3 : 1}`)
                }
              }}
            />
          ))}
          {opportunityListFetching && tab === 1 ? (
            <div className="text-center my-5">{t('loading')}</div>
          ) : null}
        </CustomSuspense>
      </div>
    </div>
  )
}

export const MobileQpportunityMoonshot = (props: Props) => {
  const { children, defalutTab } = props
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[95vh]">
        <OpportunityMoonshot
          className="relative"
          listClassName={clsx('max-md:!overflow-y-auto')}
          defalutTab={defalutTab}
        />
      </DrawerContent>
    </Drawer>
  )
}

const Nullback = () => {
  const { t } = useTranslation()
  return (
    <div className="mt-10 text-xl text-center">
      <img
        src="/images/empty.png"
        alt="Empty"
        className="w-[50%] mx-auto mb-2"
      />
      <span className="">{t('no.data.news')}</span>
    </div>
  )
}
