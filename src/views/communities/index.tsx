import { AmbassadorCard } from '@/components/ambassador-card'
import CustomSuspense from '@/components/custom-suspense'
import {
  MobileQpportunityMoonshot,
  OpportunityMoonshot,
} from '@/components/opportunity-moonshot'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

const CommunitiePage = () => {
  const { t } = useTranslation()
  const communities = [
    {
      logo: '/images/logo.png',
      name: 'Jack Ma',
      desc: '一位优秀的土狗猎手，获得过马斯克的点赞',
    },
    {
      logo: '/images/logo.png',
      name: 'Jack Ma',
      desc: '一位优秀的土狗猎手，获得过马斯克的点赞',
    },
    {
      logo: '/images/logo.png',
      name: 'Jack Ma',
      desc: '一位优秀的土狗猎手，获得过马斯克的点赞',
    },
    {
      logo: '/images/logo.png',
      name: 'Jack Ma',
      desc: '一位优秀的土狗猎手，获得过马斯克的点赞',
    },
  ]
  return (
    <main className="min-h-main flex max-md:px-3 max-sm:pt-0 max-sm:flex-col gap-6">
      <OpportunityMoonshot className="max-md:hidden"></OpportunityMoonshot>
      <div className="py-5 pr-4">
        <h1 className="text-2xl max-sm:flex max-sm:justify-between ">
          {t('communitie.ambassador')}
          <MobileQpportunityMoonshot>
            <Button
              className="md:hidden -translate-y-1 -translate-x-1"
              size={'icon'}
            >
              🔥
            </Button>
          </MobileQpportunityMoonshot>
        </h1>
        <div className="my-3">{t('community.desc').replace('$1', '50')}</div>
        <Button>{t('apply.community')}</Button>
        <CustomSuspense
          className="mt-5 grid grid-cols-3 gap-4 w-full max-2xl:grid-cols-2 max-xl:grid-cols-1"
          isPending={false}
          fallback={<CardSkeleton></CardSkeleton>}
          nullback={<></>}
        >
          {communities.map((communitie) => {
            return <AmbassadorCard data={communitie}></AmbassadorCard>
          })}
        </CustomSuspense>
        <div
          className="mt-2 text-center text-blue-700 cursor-pointer hover:text-blue-500"
          onClick={() => {}}
        >
          {t('loading.more')}
        </div>
      </div>
    </main>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <div
      className="flex items-center
     gap-4 relative"
      key={i}
    >
      <Skeleton className="w-20 h-20 flex-shrink-0 rounded-full" />

      <div className="w-full my-2 flex flex-col gap-2 mr-2">
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-[70%] h-3" />
        <Skeleton className="w-1/2 h-3" />
        <Skeleton className="w-full h-3 rounded-full mt-2" />
      </div>
    </div>
  ))
}

export default CommunitiePage
