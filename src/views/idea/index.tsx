import { Button } from '@/components/ui/button'
import HotNewsAside from '../../components/aside'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'
import { Avatar } from '@/components/ui/avatar'
import { useScroll, useWindowSize } from 'react-use'
import { ChainInfo } from './components/chain-info'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ideaApi } from '@/api/idea'
import { IdeaBasicInfo, IdeaDataList } from '@/api/idea/type'
import CustomSuspense from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { CreatedUser } from './components/created-user'
import { useRouter } from 'next/router'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { useRef, useState } from 'react'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { defaultImg } from '@/config/link'

const IdeaPage = () => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const router = useRouter()
  const newsId = router.query.id as string
  const [show, setShow] = useState(false)

  const { data: basicInfoData } = useQuery({
    queryKey: [ideaApi.getIdeaInfo.name, newsId],
    queryFn: () => {
      if (newsId == undefined) throw new Error('newsId is undefined')

      return ideaApi.getIdeaInfo(newsId)
    },
  })

  const basicInfo = basicInfoData?.data

  const {
    data: result,
    isLoading,
    isFetching,
    fetchNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: [ideaApi.getIdeaList.name, newsId],
    queryFn: ({ pageParam }) => {
      if (newsId == undefined) throw new Error('newsId is undefined')

      return ideaApi.getIdeaList(newsId, { page: pageParam })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => {
      return {
        list: data.pages.flatMap((p) => p?.data.results),
        total: data?.pages?.[0]?.data.count,
      }
    },
  })

  let count = 0
  const limit = width > 1360 ? 4 : width > 1200 ? 3 : width > 600 ? 2 : 1
  const data = result?.list

  const waterfallList = data?.length
    ? new Array<IdeaDataList[]>(limit).fill([]).map(() => [] as IdeaDataList[])
    : []

  data?.forEach((item) => {
    waterfallList[count].push(item!)
    if (++count === limit) {
      return (count = 0)
    }
  })

  const onClick = () => {
    setShow(true)
  }

  const onConfirm = () => {
    setShow(false)
  }

  window.onscroll = (e) => {
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
  }

  return (
    <main className="min-h-main px-2 pb-3 flex max-sm:px-3 max-sm:pt-0 gap-6">
      <HotNewsAside />
      <div className="max-w-[1185px] max-sm:pr-0 pr-4 flex-1 mt-6 max-sm:mt-2 max-sm:ml-0">
        <div className="flex justify-between items-center max-md:flex-col max-md:items-start">
          <div className="flex">
            <img
              src={basicInfo?.logo || defaultImg}
              alt="Logo"
              className="w-[100px] h-[100px] object-cover rounded-sm"
            />
            <div className=" ml-3">
              <div className="text-xl text">{basicInfo?.title}</div>
              <div className="mt-2 text-gray-500">{basicInfo?.description}</div>
            </div>
          </div>
          <Button className="max-md:mt-4" onClick={onClick}>
            <BsStars className="mr-1"></BsStars>
            {t('random.meme')}
          </Button>
        </div>
        <div className="my-5">{t('go.bold.man')} </div>

        <CustomSuspense
          fallback={<WaterSkeleton></WaterSkeleton>}
          nullback={<div>{t('no.data')}</div>}
          isPending={isLoading}
        >
          <div className="flex gap-4">
            {waterfallList?.map((cols, i) => {
              return (
                <div
                  key={i}
                  className="flex-1 w-[280px] max-w-[280px] max-sm:w-full max-sm:max-w-full"
                >
                  {cols?.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="mb-3 border-black rounded-lg border-2 py-2 max-sm:py-3"
                      >
                        <div className="px-2 max-sm:px-3 text-lg">
                          {item.name}
                        </div>
                        <div className="mt-2 px-2 max-sm:px-3 min-h-[50px] text-sm">
                          {item.description}
                        </div>

                        {/* <ChainInfo data={item} /> */}

                        <CreatedUser data={item} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </CustomSuspense>
        {isFetching && !isLoading ? (
          <div className="text-center my-5">{t('loading')}</div>
        ) : null}
      </div>
      <AICreateMemecoinDialog
        show={show}
        isRandom
        onConfirm={onConfirm}
        hidden={() => setShow(false)}
      ></AICreateMemecoinDialog>
    </main>
  )
}

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
