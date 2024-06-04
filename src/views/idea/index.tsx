import { Button } from '@/components/ui/button'
import { BsStars } from 'react-icons/bs'
import { useWindowScroll, useWindowSize } from 'react-use'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ideaApi } from '@/api/idea'
import { IdeaDataList } from '@/api/idea/type'
import CustomSuspense from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { CreatedUser } from './components/created-user'
import { useRouter } from 'next/router'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { memo, useEffect, useState } from 'react'
import { defaultImg } from '@/config/link'
import { Routes } from '@/routes'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import clsx from 'clsx'
import {
  MobileQpportunityMoonshot,
  OpportunityMoonshot,
} from '@/components/opportunity-moonshot'
import { useNewsList } from '@/hooks/use-news-list'
import { useTranslation } from 'react-i18next'
import { ChainInfo } from './components/chain-info'

const IdeaPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const type = router.query.type as string
  const newsId = router.query.id as string
  const [show, setShow] = useState(false)
  const { push } = useRouter()
  const { setLoadingInfoDialog, setInfo, setFormInfo, setLoadingImg } =
    useAimemeInfoStore()
  const [tab, setTab] = useState(1)

  const { width } = useWindowSize()
  const { y } = useWindowScroll()

  const newsListData = useNewsList({
    isOpportunity: tab === 1,
  })

  const onCreateNow = (item: IdeaDataList) => {
    push(`${Routes.Create}`)
    setFormInfo({
      name: item?.name,
      symbol: item?.name,
      description: item?.description,
    })
    setLoadingImg(true)
  }

  const { data: basicInfoData } = useQuery({
    queryKey: [ideaApi.getIdeaInfo.name, newsId, type],
    queryFn: () => {
      if (newsId == undefined || type === undefined) {
        throw new Error('newsId is undefined')
      }

      return ideaApi.getIdeaInfo(newsId, { type })
    },
  })

  const basicInfo = basicInfoData?.data

  const {
    data: waterfallList,
    isLoading,
    isFetching,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [ideaApi.getIdeaList.name, newsId, type],
    queryFn: ({ pageParam }) => {
      if (newsId == undefined || type === undefined) {
        throw new Error('newsId is undefined')
      }

      return ideaApi.getIdeaList(newsId, { page: pageParam, type })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => {
      console.log('data', data)
      return {
        list: data.pages.flatMap((p) => p.data.results),
        total: data.pages[0]?.data.count,
      }
    },
    // select: (data) => {
    //   const list = data.pages.flatMap((p) => p?.data.results)
    //   let count = 0
    //   const limit = width > 1590 ? 4 : width > 1250 ? 3 : width > 600 ? 2 : 1
    //   const waterfallList = list?.length
    //     ? new Array<IdeaDataList[]>(limit)
    //         .fill([])
    //         .map(() => [] as IdeaDataList[])
    //     : []

    //   list?.forEach((item) => {
    //     waterfallList[count].push(item!)
    //     if (++count === limit) {
    //       return (count = 0)
    //     }
    //   })

    //   return {
    //     list: waterfallList,
    //     total: data?.pages?.[0]?.data.count,
    //   }
    // },
  })

  const onRandomCreate = () => {
    setShow(true)
  }

  const memeInfo = {
    name: basicInfo?.title,
    image: basicInfo?.logo,
    description: basicInfo?.content,
  }

  const onConfirm = () => {
    setShow(false)
    push(Routes.Create)
    setInfo(memeInfo)
    setLoadingInfoDialog(true)
  }

  const onCancel = () => {
    setShow(false)
  }

  useEffect(() => {
    // 检查是否滚动到底部
    if (
      window.innerHeight +
        document.documentElement.scrollTop -
        document.documentElement.offsetHeight >=
        -(window.innerHeight / 2) &&
      !isFetching &&
      !isFetchNextPageError
    ) {
      // 加载下一页的数据
      fetchNextPage()
    }
  }, [y])

  console.log('list', waterfallList?.list)

  return (
    <main className="min-h-main flex max-sm:px-3 max-sm:pt-0 max-sm:flex-col gap-6">
      <OpportunityMoonshot
        className="max-sm:!hidden max-sm:!px-0"
        newsListData={newsListData}
        isDialogLoading={false}
        onConfirmDialog={() => {}}
        tab={tab}
        setTab={setTab}
      />
      <div className="max-w-[1185px] max-sm:pr-0 pr-6 flex-1 mt-6 max-sm:mt-2 max-sm:ml-0">
        <div className="flex justify-between items-center max-md:flex-col max-md:items-start">
          <div className="flex">
            <img
              src={basicInfo?.logo || defaultImg}
              alt="Logo"
              className="w-[100px] h-[100px] object-cover rounded-sm"
            />
            <div className="ml-3">
              <div className="text-xl text">{basicInfo?.title}</div>
              <Content content={basicInfo?.content}></Content>
            </div>
          </div>
          <div className="flex max-md:mt-4">
            <Button onClick={onRandomCreate}>
              <BsStars className="mr-1"></BsStars>
              {t('random.meme')}
            </Button>
            <MobileQpportunityMoonshot
              className="max-sm:!hidden max-sm:!px-0 "
              newsListData={newsListData}
              isDialogLoading={false}
              onConfirmDialog={() => {}}
              tab={tab}
              setTab={setTab}
            >
              <div className="sm:hidden ml-4">
                <Button className="bg-white text-2xl" size={'icon'}>
                  💡
                </Button>
              </div>
            </MobileQpportunityMoonshot>
          </div>
        </div>
        {waterfallList?.list.length ? (
          <div className="my-5">{t('go.bold.man')} </div>
        ) : null}

        <CustomSuspense
          fallback={<WaterSkeleton></WaterSkeleton>}
          nullback={<div className="mt-5">{t('no.idea')}</div>}
          isPending={isLoading}
          className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 pb-6"
        >
          {waterfallList?.list?.map((item, i) => {
            return (
              <div
                key={i}
                className="flex-1 max-sm:w-full max-sm:max-w-full break-inside-avoid"
              >
                <div
                  key={item?.id}
                  className="mb-3 border-black rounded-lg border-2 py-2 max-sm:py-3"
                >
                  <div className="flex justify-between items-start px-2 max-sm:px-3 text-lg gap-2 font-bold">
                    {item?.name}
                  </div>

                  <div className="flex">
                    <img
                      src={item?.logo}
                      alt="img"
                      className="w-20 h-20 rounded mx-2"
                    />
                    <Desc description={item?.description ?? ''}></Desc>
                  </div>

                  <ChainInfo ideaData={item} />

                  <CreatedUser ideaData={item} />
                </div>
              </div>
            )
          })}
        </CustomSuspense>
        {isFetching && !isLoading ? (
          <div className="text-center my-5">{t('loading')}</div>
        ) : null}
      </div>
      <AICreateMemecoinDialog
        show={show}
        data={memeInfo}
        onConfirm={onConfirm}
        onCancel={onCancel}
      ></AICreateMemecoinDialog>
    </main>
  )
}

const Content = memo(({ content }: { content?: string }) => {
  const [show, setShow] = useState(false)
  return (
    <div
      className={clsx(
        'mt-2 text-gray-500 max-w-[90%] cursor-pointer leading-[23px]',
        show ? '' : 'line-clamp-3'
      )}
      onClick={() => setShow(!show)}
    >
      {content}
    </div>
  )
})

const Desc = memo(({ description }: { description: string }) => {
  const [show, setShow] = useState(false)
  const randomInt = Math.floor(Math.random() * 4) + 3

  return (
    <>
      <div
        className={clsx(
          'max-sm:px-3 min-h-[50px] text-sm cursor-pointer',
          show ? '' : 'line-clamp-4'
        )}
        onClick={() => setShow(!show)}
      >
        {description}
        <span className="line-clamp-3 "></span>
        <span className="line-clamp-4 "></span>
        <span className="line-clamp-5 "></span>
        <span className="line-clamp-6 "></span>
        <span className="line-clamp-7 "></span>
      </div>
    </>
  )
})

const WaterSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="flex gap-2 relative" key={i}>
          <div className="w-full my-2 flex flex-col gap-2 mr-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-[70%] h-3" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-[70%] h-3" />
            <Skeleton className="w-1/2 h-3" />
            <Skeleton className="w-full h-5 rounded-full mt-2" />
          </div>
          <Skeleton className="w-8 h-8 absolute right-2 top-2" />
        </div>
      ))}
    </div>
  )
}

export default IdeaPage
