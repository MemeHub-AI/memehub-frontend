import { useEffect, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { CustomSuspense } from '@/components/custom-suspense'
import { NewsCard } from '@/components/news'
import { newsDefaultArea, useNewsList } from '@/hooks/use-news-list'
import { NewsSkeleton } from '@/components/news/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocalStorage } from '@/hooks/use-storage'
import { utilLang } from '@/utils/lang'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Button } from './ui/button'
import { DrawerTrigger, DrawerContent, Drawer } from './ui/drawer'
import { newsApi } from '@/api/news'
import { useAsideStore } from '@/stores/use-aside-store'
import { useResponsive } from '@/hooks/use-responsive'
// TODO/low: wrapped `CollapseAside`
import { CollapseAside } from './collapse-aside'
import { joinPaths } from '@/utils'
import AllTradesFeeds from './header/all-trades-feed'

interface Props extends ComponentProps<'div'> {
  defalutTab?: string | string[] | number
  listClassName?: string
  containerClass?: string
  tabClass?: string
}

enum Tab {
  Moonshot,
  Classic,
}

const containerClassName = `flex flex-col gap-3 max-md:gap-4 max-md:overflow-y-clip  overflow-y-auto`

export const NewsAside = ({
  defalutTab = 1,
  className,
  listClassName,
  containerClass,
  tabClass,
}: Props) => {
  const { getStorage, setStorage } = useLocalStorage()
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
    setStorage('area', value)
    setArea(+value)
  }

  const onChangeTab = (idx: number) => {
    setTab(idx)

    if (isPad) {
      if (idx === 0) push(Routes.NewsMoonshot)
      else if (idx === 1) push(Routes.NewsClassicMeme)
    }
  }

  const nullback = () => (
    <div className="mt-10 text-xl text-center">
      <img
        src="/images/empty.png"
        alt="Empty"
        className="w-[50%] mx-auto mb-2"
      />
      <span className="">{t('no.data.news')}</span>
    </div>
  )

  useEffect(() => {
    if (!defalutTab) return
    if (defalutTab === '1') {
      setTab(Tab.Moonshot)
    } else if (defalutTab === '2') {
      setTab(Tab.Classic)
    }
  }, [defalutTab])

  return (
    <aside
      className={cn(
        'pr-2 h-body hidden xl:block',
        'max-sm:mr-0 max-sm:pr-0 max-sm:h-min max-sm:border-0',
        'lg:before:absolute lg:before:border-l lg:before:border-zinc-200 lg:before:-top-28 lg:before:left-0 lg:before:-bottom-16',
        className
      )}
    >
      <AllTradesFeeds />
      <div
        className={cn(
          'sticky top-[20px] ml-6 w-aside max-sm:ml-0 max-md:px-4 max-md:order-2 max-md:w-full',
          tab === Tab.Classic
            ? 'h-[80vh] max-lg:h-[84vh]'
            : 'h-[82vh] max-lg:h-[84vh]',
          containerClass
        )}
      >
        <div className="flex items-start justify-between">
          {tabs.map((t, i) => {
            return (
              <div
                key={i}
                className={cn(
                  'px-2.5 py-1.5 text-nowrap rounded-xl my-5 cursor-pointer border-2 border-transparent',
                  'hover:border-black select-none flex-1 text-center',
                  i === Tab.Classic && 'ml-3',
                  tab === i && 'bg-black text-[#ffe770]',
                  tabClass
                )}
                onClick={() => onChangeTab(i)}
              >
                {t}
              </div>
            )
          })}
        </div>
        {tab === Tab.Moonshot ? (
          <Select
            defaultValue={getStorage('area') || newsDefaultArea}
            onValueChange={onChange}
          >
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
                  {utilLang.locale(country.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <CustomSuspense
          ref={ref}
          isPending={isLoading}
          fallback={<NewsSkeleton />}
          nullback={tab === Tab.Moonshot && nullback()}
          className={cn(
            containerClassName,
            tab === 1 ? 'h-[calc(100vh-170px)]' : 'h-[calc(100vh-220px)]',
            tab === 1 && 'hidden',
            listClassName
          )}
        >
          {newsList?.map((news, i) => (
            <NewsCard
              news={news!}
              key={i}
              onClick={() => {
                push({
                  pathname: joinPaths(Routes.News, news?.id),
                  query: { type: tab + 1 },
                })
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
          nullback={tab === Tab.Classic && nullback()}
          className={cn(
            containerClassName,
            tab === Tab.Classic
              ? 'h-[calc(100vh-170px)]'
              : 'h-[calc(100vh-120px)]',
            tab === Tab.Moonshot ? 'hidden' : '',
            listClassName
          )}
        >
          {opportunityList?.map((news, i) => (
            <NewsCard
              news={news!}
              key={i}
              onClick={() => {
                const url = {
                  pathname: joinPaths(Routes.News, news?.id),
                  query: { type: tab === 1 ? 3 : 1 },
                }

                if (router.pathname.startsWith(Routes.News)) {
                  replace(url)
                } else {
                  push(url)
                }
              }}
            />
          ))}
          {opportunityListFetching && tab === 1 ? (
            <div className="text-center my-5">{t('loading')}</div>
          ) : null}
        </CustomSuspense>
      </div>
    </aside>
  )
}

export const NewsAsideMobile = ({ children, defalutTab }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[95vh]">
        <NewsAside
          className="relative"
          listClassName={cn('max-md:!overflow-y-auto')}
          defalutTab={defalutTab}
        />
      </DrawerContent>
    </Drawer>
  )
}
