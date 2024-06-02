import { Button } from '@/components/ui/button'
import HotNewsAside from '../../components/aside'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'
import { Avatar } from '@/components/ui/avatar'
import { useWindowSize } from 'react-use'
import { ChainInfo } from './components/chain-info'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ideaApi } from '@/api/idea'
import { IdeaData } from '@/api/idea/type'
import CustomSuspense from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { CreatedUser } from './components/created-user'
import { useRouter } from 'next/router'

const IdeaPage = () => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const router = useRouter()
  const newsId = router.query.id as string

  const { data: result, isLoading } = useInfiniteQuery({
    queryKey: [ideaApi.getIdea.name, newsId],
    queryFn: ({ pageParam }) => {
      return ideaApi.getIdea({ page: pageParam })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => {
      return {
        list: data.pages.flatMap((p) => p.data.results),
        total: data.pages[0].data.count,
      }
    },
  })

  let count = 0
  const limit = width > 1360 ? 4 : width > 1200 ? 3 : width > 600 ? 2 : 1
  const data = result?.list

  const waterfallList = new Array<IdeaData[]>(limit)
    .fill([])
    .map(() => [] as IdeaData[])

  data?.forEach((item) => {
    waterfallList[count].push(item!)
    if (++count === limit) {
      return (count = 0)
    }
  })

  return (
    <main className="min-h-main px-2 pb-3 flex max-sm:px-3 max-sm:pt-0 gap-6">
      <HotNewsAside />
      <div className="max-w-[1185px] max-sm:pr-0 pr-4 flex-1 ml-4 mt-4 max-sm:mt-2 max-sm:ml-0">
        <div className="flex justify-between items-center max-md:flex-col max-md:items-start">
          <div className="flex">
            <img
              src="/images/ai.jpg"
              alt="Logo"
              className="w-[100px] h-[100px] object-cover rounded-sm"
            />
            <div className=" ml-3">
              <div className="text-xl text">特朗普</div>
              <div className="mt-2 text-gray-500">
                特朗普表示支持加密货币，Trump概念 Meme 币大火
              </div>
            </div>
          </div>
          <Button className="max-md:mt-4">
            <BsStars className="mr-1"></BsStars>
            {t('random.meme')}
          </Button>
        </div>
        <div className="my-5">
          未来的千万富翁，MemeHub AI为阁下联想到了以下创意，Go Bold man
        </div>

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
                    console.log(item)

                    return (
                      <div
                        key={item.id}
                        className="mb-3 border-black rounded-lg border-2 py-2 max-sm:py-3"
                      >
                        <div className="px-2 max-sm:px-3 text-lg">
                          {item.title}
                        </div>
                        <div className="my-2 px-2 max-sm:px-3 min-h-[50px] text-sm">
                          {item.description}
                        </div>

                        <ChainInfo data={item} />

                        <div className="border-t my-2"></div>
                        <CreatedUser data={item} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </CustomSuspense>
      </div>
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
