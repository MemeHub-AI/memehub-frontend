import { Button } from '@/components/ui/button'
import { BsStars } from 'react-icons/bs'
import { useQuery } from '@tanstack/react-query'
import { ideaApi } from '@/api/idea'
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
import { WaterList } from './components/water-list'

const IdeaPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const type = window.location.search.match(/type=(\d+)/)?.[1] as string
  const newsId = router.query.id as string
  const [show, setShow] = useState(false)
  const { push } = useRouter()
  const { setLoadingInfoDialog, setInfo } = useAimemeInfoStore()
  const [tab, setTab] = useState(+type - 1)

  const newsListData = useNewsList({
    isOpportunity: tab === 1,
  })

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
    if (newsId !== undefined || type !== undefined) {
    }
  }, [newsId, type])

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
        <WaterList newsId={newsId} type={type}></WaterList>
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

export default IdeaPage
