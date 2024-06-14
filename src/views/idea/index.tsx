import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { BsStars } from 'react-icons/bs'
import { useQuery } from '@tanstack/react-query'
import { ideaApi } from '@/api/idea'
import { useRouter } from 'next/router'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { memo, useState } from 'react'
import { defaultImg } from '@/config/link'
import { Routes } from '@/routes'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useTranslation } from 'react-i18next'
import { WaterList } from './components/water-list'
import {
  MobileQpportunityMoonshot,
  OpportunityMoonshot,
} from '@/components/opportunity-moonshot'
import { cn } from '@/lib/utils'
import { MemeStory } from './components/meme-story'
import { newsApi } from '@/api/news'

const IdeaPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const type = window.location.search.match(/type=(\d+)/)?.[1] as string
  const newsId = router.query.id as string
  const [show, setShow] = useState(false)
  const { push } = useRouter()
  const { setLoadingInfoDialog, setInfo } = useAimemeInfoStore()
  const defualtTab = Math.min(+type - 1, 1)

  // const [tabIdx, setTab] = useState(defualtTab)
  // const tabs = [t('ideas'), t('meme.story')]

  const { data: basicInfoData } = useQuery({
    queryKey: [ideaApi.getIdeaInfo.name, newsId, type],
    queryFn: () => {
      if (newsId == undefined || type === undefined) {
        throw new Error('newsId is undefined')
      }

      if (+type === 3) {
        return ideaApi.getMemeStory(newsId as string)
      }

      return ideaApi.getIdeaInfo(newsId, { type })
    },
  })

  const basicInfo = basicInfoData?.data

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

  return (
    <main className="min-h-main flex max-md:px-3 max-sm:pt-0 max-sm:flex-col gap-6">
      <OpportunityMoonshot
        defalutTab={defualtTab}
        className="max-md:!hidden max-sm:!px-0"
      />
      <div className="max-w-[1185px] max-md:pr-0 pr-6 flex-1 mt-6 max-sm:mt-2 max-sm:ml-0">
        <div className="flex justify-between items-center max-md:flex-col max-md:items-start">
          <div className="flex flex-1">
            <img
              src={basicInfo?.logo || defaultImg}
              alt="Logo"
              className="w-[100px] h-[100px] object-cover rounded-sm"
            />
            <div className="ml-3 w-full">
              <div className="text-xl text">{basicInfo?.title}</div>
              <Content content={basicInfo?.description}></Content>
            </div>
          </div>

          <div className="flex max-md:mt-4">
            <Button onClick={onRandomCreate}>
              <BsStars className="mr-1"></BsStars>
              {type !== '3' ? t('random.meme') : t('meme.it')}
            </Button>
            <MobileQpportunityMoonshot
              defalutTab={defualtTab}
              className="max-md:!hidden max-sm:!px-0 "
            >
              <div className="md:hidden ml-4">
                <Button className="bg-white text-2xl" size={'icon'}>
                  💡
                </Button>
              </div>
            </MobileQpportunityMoonshot>
          </div>
        </div>
        {/* {+type === 2 ? (
          <div className="flex items-start">
            {tabs.map((tab, i) => {
              return (
                <div
                  key={i}
                  className={cn(
                    'px-2.5 py-1.5 text-nowrap rounded-xl mt-5 cursor-pointer border-2 border-transparent',
                    'hover:border-black',
                    i === 1 && 'ml-3',
                    tabIdx == i && 'bg-black text-[#ffe770]'
                  )}
                  onClick={() => setTab(i)}
                >
                  {tab}
                </div>
              )
            })}
          </div>
        ) : null} */}
        {/* tabIdx === 0 ||  */}
        {type !== '3' ? (
          <WaterList newsId={newsId} type={type}></WaterList>
        ) : (
          <MemeStory data={basicInfo!}></MemeStory>
        )}
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
        'mt-2 max-sm:mt-1 text-gray-500 max-w-[90%] max-sm:max-w-full cursor-pointer leading-[23px]',
        show ? '' : 'line-clamp-3 max-sm:line-clamp-2'
      )}
      onClick={() => setShow(!show)}
    >
      {content}
    </div>
  )
})

export default IdeaPage
